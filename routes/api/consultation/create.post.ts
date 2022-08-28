import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import RoleManager from "%/managers/role"
import JSONController from "!/controllers/json"
import ConsultationManager from "%/managers/consultation"
import CreatedResponseInfo from "!/response_infos/created"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

import date from "!/validators/base/date"
import object from "!/validators/base/object"
import string from "!/validators/base/string"
import boolean from "!/validators/base/boolean"
import integer from "!/validators/base/integer"
import same from "!/validators/comparison/same"
import exists from "!/validators/manager/exists"
import required from "!/validators/base/required"
import nullable from "!/validators/base/nullable"
import regex from "!/validators/comparison/regex"
import makeRelationshipRules from "!/rule_sets/make_relationships"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"
import existWithSameAttribute from "!/validators/manager/exist_with_same_attribute"
import uniqueConsultationSchedule from "!/validators/date/unique_consultation_schedule"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return CommonMiddlewareList.studentOnlyPolicy
	}

	makeBodyRuleGenerator(unusedRequest: Request): FieldRules {
		const attributes: FieldRules = {
			"actionTaken": {
				"constraints": {
					"same": {
						"value": null
					}
				},
				"pipes": [ nullable, same ]
			},
			"finishedAt": {
				"constraints": {
					"same": {
						"value": null
					}
				},
				"pipes": [ nullable, same ]
			},
			"reason": {
				"constraints": {
					"regex": {
						"match": /[a-zA-Z0-9!?.-]/u
					}
				},
				"pipes": [ required, string, regex ]
			},
			"scheduledStartAt": {
				"constraints": {
					"uniqueConsultationSchedule": {
						"conflictConfirmationPointer": "meta.doesAllowConflicts",
						"userIDPointer": "meta.reachableEmployeeID"
					}
				},
				"pipes": [ required, date, uniqueConsultationSchedule ]
			},
			"startedAt": {
				"constraints": {
					"same": {
						"value": null
					}
				},
				"pipes": [ nullable, same ]
			}
		}

		const relationships: FieldRules = makeRelationshipRules([
			{
				"ClassName": UserManager,
				"isArray": false,
				"relationshipName": "consultant",
				"typeName": "user",
				"validator": exists
			},
			{
				"ClassName": RoleManager,
				"isArray": false,
				"relationshipName": "consultantRole",
				"typeName": "role",
				"validator": exists
			},
			{
				"ClassName": UserManager,
				"isArray": true,
				"relationshipName": "consulters",
				"typeName": "user",
				"validator": exists
			}
		])

		const meta: FieldRules = {
			"meta": {
				"constraints": {
					"object": {
						"doesAllowConflicts": {
							"constraints": {
								"boolean": {
									"loose": false
								}
							},
							"pipes": [ required, boolean ]
						},
						"reachableEmployeeID": {
							"constraints": {
								"integer": {
									"mustCast": true
								},
								"manager": {
									"className": UserManager,
									"columnName": "id"
								},
								"sameAttribute": {
									"columnName": "kind",
									"value": "reachable_employee"
								}
							},
							"pipes": [ required, string, integer, existWithSameAttribute ]
						}
					}
				},
				"pipes": [ required, object ]
			}
		}

		return makeResourceDocumentRules(
			"consultation",
			attributes,
			{
				"extraDataQueries": relationships,
				"extraQueries": meta,
				"isNew": true,
				"mustCastID": true
			}
		)
	}

	async handle(request: Request, unusedResponse: Response): Promise<CreatedResponseInfo> {
		const manager = new ConsultationManager(request.transaction, request.cache)

		const consultationInfo = await manager.create(request.body.data.attributes)

		return new CreatedResponseInfo(consultationInfo)
	}
}
