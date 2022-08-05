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

import extractEmailUsername from "$!/helpers/extract_email_username"

import Log from "$!/singletons/log"
import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import RoleManager from "%/managers/role"
import Middleware from "!/bases/middleware"
import DepartmentManager from "%/managers/department"
import CSVParser from "!/middlewares/body_parser/csv"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import MultipartController from "!/controllers/multipart_controller"

import BodyValidation from "!/validations/body"
import { IMPORT_USERS } from "$/permissions/user_combinations"
import { user as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/policies/permission-based"

import array from "!/validators/base/array"
import object from "!/validators/base/object"
import string from "!/validators/base/string"
import buffer from "!/validators/base/buffer"
import integer from "!/validators/base/integer"
import same from "!/validators/comparison/same"
import exists from "!/validators/manager/exists"
import required from "!/validators/base/required"
import oneOf from "!/validators/comparison/one-of"
import length from "!/validators/comparison/length"
import notExists from "!/validators/manager/not_exists"

export default class extends MultipartController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			IMPORT_USERS
		])
	}

	get postParseMiddlewares(): OptionalMiddleware[] {
		// TODO: Think of the maximum size of the CSV file. currently accepting 1MB.
		const maxSize = 1*1000
		return [
			new BodyValidation((request: Request): FieldRules => ({
				data: {
					pipes: [ required, object ],
					constraints: {
						object: {
							type: {
								pipes: [ required, string, same ],
								constraints: {
									same: {
										value: "user"
									}
								}
							},
							attributes: {
								pipes: [ required, object ],
								constraints: {
									object: {
										kind: {
											pipes: [ required, string, oneOf ],
											constraints: {
												oneOf: {
													values: [ ...UserKindValues ]
												}
											}
										}
									}
								}
							},
							relationships: {
								pipes: [ required, object ],
								constraints: {
									object: {
										roles: {
											pipes: [ required, object ],
											constraints: {
												object: {
													data: {
														pipes: [ required, array, length ],
														constraints: {
															array: {
																pipes: [ required, object ],
																constraints: {
																	object: {
																		type: {
																			pipes: [ required, string, same ],
																			constraints: {
																				same: {
																					value: "user"
																				}
																			}
																		},
																		id: {
																			pipes: [
																				required,
																				string,
																				integer,
																				exists
																			],
																			constraints: {
																				manager: {
																					className: RoleManager,
																					columnName: "id"
																				}
																			}
																		}
																	}
																}
															},
															length: {
																minimum: 1
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				},
				meta: {
					pipes: [ required, object ],
					constraints: {
						object: {
							importedCSV: {
								pipes: [ required, buffer ],
								constraints: {
									buffer: {
										allowedMimeTypes: [ "text/csv" ],
										maxSize
									}
								}
							}
						}
					}
				}
			})),
			new CSVParser("meta.importedCSV")
		]
	}

	makeBodyRuleGenerator(request: Request): FieldRules {
		// TODO: Make validator to validate name
		return {
			data: {
				pipes: [ required ]
			},
			meta: {
				pipes: [ required, object ],
				constraints: {
					object: {
						importedCSV: {
							pipes: [ required, array, length ],
							constraints: {
								array: {
									pipes: [ required, object ],
									constraints: {
										object: {
											name: {
												pipes: [ required, string, notExists ],
												constraints: {
													manager: {
														className: UserManager,
														columnName: "name"
													}
												}
											},
											email: {
												pipes: [ required, string, notExists ],
												constraints: {
													manager: {
														className: UserManager,
														columnName: "email"
													}
												}
											},
											department: {
												// TODO: Add validator to match if department may admit
												pipes: [ required, string, exists ],
												constraints: {
													manager: {
														className: DepartmentManager,
														columnName: "acronym"
													}
												}
											}
										}
									}
								},
								length: {
									minimum: 1,
									maximum: 200
								}
							}
						}
					}
				}
			}
		}
	}

	async handle(
		request: PreprocessedRequest<NewUserNotificationArguments>,
		response: Response
	): Promise<void> {
		Log.trace("controller", "entered POST /api/user/import")

		const manager = new UserManager(request.transaction, request.cache)
		const importedBody = request.body as unknown as ImportUserDocument
		const body: Partial<RawBulkData> = {}

		body.kind = importedBody.data.attributes.kind
		body.roles = importedBody.data.relationships.roles.data.map(identifier => identifier.id)
		body.importedCSV = importedBody.meta.importedCSV

		Log.trace("controller", "made user manager")

		body.importedCSV = body.importedCSV!.map(data => {
			// ! If there is a change below, update `$!/helpers/make_default_password` too.
			if (body.kind! === "student") {
				data.password = (data as RawBulkDataForStudent).studentNumber
			} else {
				const email = (data as RawBulkDataForEmployee).email
				data.password = extractEmailUsername(email)
			}
			return data
		})

		Log.trace("controller", "generated default passwords")

		const createdModels = await manager.bulkCreate(body as RawBulkData)

		Log.success("controller", "created users in bulk")

		const userDetails = body.importedCSV.map(data => {
			return {
				name: data.name,
				email: data.email,
				kind: body.kind as UserKind,
				password: data.password
			}
		})
		request.nextMiddlewareArguments = { userDetails }

		Log.success("controller", "prepared data to inform new users")

		response.status(this.status.OK).json(createdModels)

		Log.trace("controller", "exiting POST /api/user/import")
	}

	get postJobs(): Middleware[] {
		return [
			CommonMiddlewareList.newUserNotification
		]
	}
}
