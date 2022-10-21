import type { FieldRules } from "!/types/validation"
import { UserKindValues, UserKind } from "$/types/database"
import type { ImportUserDocument } from "!/types/documents/user"
import type { PreprocessedRequest, Request, Response } from "!/types/dependent"
import type { OptionalMiddleware, NewUserNotificationArguments } from "!/types/independent"
import type {
	RawBulkData,
	RawBulkDataForStudent,
	RawBulkDataForEmployee
} from "%/types/independent"

import { MAXIMUM_FILE_SIZE, MINIMUM_FILE_SIZE } from "!/constants/measurement"
import {
	personName,
	personNameDescription,
	studentNumber,
	studentNumberDescription
} from "$!/constants/regex"

import extractEmailUsername from "$!/helpers/extract_email_username"
import Log from "$!/singletons/log"
import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import RoleManager from "%/managers/role"
import Middleware from "!/bases/middleware"
import DepartmentManager from "%/managers/department"
import CSVParser from "!/middlewares/body_parser/csv"
import CreatedResponse from "!/response_infos/created"
import MultipartController from "!/controllers/multipart"
import ActionAuditor from "!/middlewares/miscellaneous/action_auditor"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

import BodyValidation from "!/validations/body"
import { IMPORT_USERS } from "$/permissions/user_combinations"
import PermissionBasedPolicy from "!/policies/permission-based"
import { user as permissionGroup } from "$/permissions/permission_list"

import array from "!/validators/base/array"
import object from "!/validators/base/object"
import string from "!/validators/base/string"
import buffer from "!/validators/base/buffer"
import exists from "!/validators/manager/exists"
import required from "!/validators/base/required"
import nullable from "!/validators/base/nullable"
import regex from "!/validators/comparison/regex"
import oneOf from "!/validators/comparison/one-of"
import length from "!/validators/comparison/length"
import notExists from "!/validators/manager/not_exists"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"
import makeResourceIdentifierListDocumentRules
	from "!/rule_sets/make_resource_identifier_list_document"

export default class extends MultipartController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			IMPORT_USERS
		])
	}

	get postParseMiddlewares(): OptionalMiddleware[] {
		return [
			new BodyValidation((unusedRequest: Request): FieldRules => {
				const attributes = {
					"kind": {
						"constraints": {
							"oneOf": {
								"values": [ ...UserKindValues ]
							}
						},
						"pipes": [ required, string, oneOf ]
					}
				}
				const relationships = {
					"constraints": {
						"object": {
							"roles": {
								"constraints": {
									"object": makeResourceIdentifierListDocumentRules(
										"role",
										exists,
										RoleManager
									)
								},
								"pipes": [ required, object ]
							}
						}
					},
					"pipes": [ required, object ]
				}
				const meta = {
					"constraints": {
						"object": {
							"importedCSV": {
								"constraints": {
									"buffer": {
										"allowedMimeTypes": [ "text/csv", "application/vnd.ms-excel" ],
										"maximumSize": MAXIMUM_FILE_SIZE,
										"minimumSize": MINIMUM_FILE_SIZE
									}
								},
								"pipes": [ required, buffer ]
							}
						}
					},
					"pipes": [ required, object ]
				}

				return makeResourceDocumentRules("user", attributes, {
					"extraDataQueries": { relationships },
					"extraQueries": { meta },
					"isNew": true
				})
			}),
			new CSVParser("meta.importedCSV")
		]
	}

	makeBodyRuleGenerator(unusedRequest: Request): FieldRules {
		return {
			"data": {
				"pipes": [ required ]
			},
			"meta": {
				"constraints": {
					"object": {
						"importedCSV": {
							"constraints": {
								"array": {
									"constraints": {
										"object": {
											"department": {
												// TODO: Add validator to match if department may admit
												"constraints": {
													"manager": {
														"className": DepartmentManager,
														"columnName": "acronym"
													}
												},
												"pipes": [ required, string, exists ]
											},
											"email": {
												"constraints": {
													"manager": {
														"className": UserManager,
														"columnName": "email"
													}
												},
												"pipes": [ required, string, notExists ]
											},
											"name": {
												"constraints": {
													"manager": {
														"className": UserManager,
														"columnName": "name"
													},
													"regex": {
														"friendlyDescription": personNameDescription,
														"match": personName
													}
												},
												"pipes": [ required, string, regex, notExists ]
											},
											"studentNumber": {
												"constraints": {
													"regex": {
														"friendlyDescription": studentNumberDescription,
														"match": studentNumber
													}
												},
												"pipes": [ nullable, string, regex ]
											}
										}
									},
									"pipes": [ required, object ]
								},
								"length": {
									"maximum": 200,
									"minimum": 1
								}
							},
							"pipes": [ required, array, length ]
						}
					}
				},
				"pipes": [ required, object ]
			}
		}
	}

	async handle(
		request: PreprocessedRequest<NewUserNotificationArguments>,
		unusedResponse: Response
	): Promise<CreatedResponse> {
		Log.trace("controller", "entered POST /api/user/import")

		const manager = new UserManager(request)
		const importedBody = request.body as unknown as ImportUserDocument
		const body: Partial<RawBulkData> = {}

		body.kind = importedBody.data.attributes.kind
		body.roles = importedBody.data.relationships.roles.data
		.map(identifier => Number(identifier.id))
		body.importedCSV = importedBody.meta.importedCSV

		Log.trace("controller", "made user manager")

		body.importedCSV = body.importedCSV.map(data => {
			// ! If there is a change below, update `$!/helpers/make_default_password` too.
			if (body.kind === "student") {
				const castData = data as RawBulkDataForStudent
				data.password = castData.studentNumber
			} else {
				const { email } = data as RawBulkDataForEmployee
				data.password = extractEmailUsername(email)
			}

			data.prefersDark = false

			return data
		})

		Log.trace("controller", "generated default passwords")

		const createdModels = await manager.bulkCreate(body as RawBulkData)

		Log.success("controller", "created users in bulk")

		const userDetails = body.importedCSV.map(data => ({
			"email": data.email,
			"kind": body.kind as UserKind,
			"name": data.name,
			"password": data.password
		}))
		request.nextMiddlewareArguments = { userDetails }

		Log.success("controller", "prepared data to inform new users")

		return new CreatedResponse(createdModels)

		Log.trace("controller", "exiting POST /api/user/import")
	}

	get postJobs(): Middleware[] {
		return [
			CommonMiddlewareList.newUserNotification,
			new ActionAuditor("user.import")
		]
	}
}
