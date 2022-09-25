import type { FieldRules } from "!/types/validation"
import type { EmployeeScheduleDocument } from "$/types/documents/employee_schedule"
import type { AuthenticatedIDRequest, Response, BaseManagerClass } from "!/types/dependent"

import { DayValues } from "$/types/database"

import Log from "$!/singletons/log"
import UserManager from "%/managers/user"
import JSONController from "!/controllers/json"
import CreatedResponseInfo from "!/response_infos/created"
import EmployeeScheduleManager from "%/managers/employee_schedule"
import convertTimeToMinutes from "$/time/convert_time_to_minutes"

import Policy from "!/bases/policy"
import { user as permissionGroup } from "$/permissions/permission_list"
import OverridableKindBasedPolicy from "!/policies/overridable_kind-based"
import {
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import exists from "!/validators/manager/exists"
import required from "!/validators/base/required"
import range from "!/validators/comparison/range"
import oneOf from "!/validators/comparison/one-of"
import divisibleBy from "!/validators/date/divisible_by"
import makeRelationshipRules from "!/rule_sets/make_relationships"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"
import uniqueEmployeeSchedule from "!/validators/date/unique_employee_schedule"
import existWithSameAttribute from "!/validators/manager/exist_with_same_attribute"
import doesBelongToCurrentUser from "!/validators/manager/does_belong_to_current_user"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new OverridableKindBasedPolicy(
			[ "reachable_employee" ],
			permissionGroup,
			UPDATE_ANYONE_ON_OWN_DEPARTMENT,
			UPDATE_ANYONE_ON_ALL_DEPARTMENTS
		)
	}

	makeBodyRuleGenerator(unusedRequest: AuthenticatedIDRequest): FieldRules {
		/*
		 * TODO: Make validator if the schedule start is less than schedule end
		 */
		const attributes: FieldRules = {
			"dayName": {
				"constraints": {
					"oneOf": {
						"values": [ ...DayValues ]
					}
				},
				"pipes": [ required, string, oneOf ]
			},
			"scheduleEnd": {
				"constraints": {
					"divisibleBy": {
						"value": 15
					},
					"range": {
						"maximum": convertTimeToMinutes("23:59"),
						"minimum": convertTimeToMinutes("00:01")
					}
				},
				"pipes": [ required, integer, divisibleBy, range ]
			},
			"scheduleStart": {
				"constraints": {
					"divisibleBy": {
						"value": 15
					},
					"range": {
						"maximum": convertTimeToMinutes("23:58"),
						"minimum": convertTimeToMinutes("00:00")
					}
				},
				"pipes": [ required, integer, divisibleBy, range ]
			}
		}

		const relationships: FieldRules = makeRelationshipRules([
			{
				"ClassName": UserManager,
				"isArray": false,
				"options": {
					"postIDRules": {
						"constraints": {
							"doesBelongToCurrentUser": {
								"anyPermissionCombinationForBypass": [
									UPDATE_ANYONE_ON_OWN_DEPARTMENT,
									UPDATE_ANYONE_ON_ALL_DEPARTMENTS
								],
								permissionGroup
							},
							"sameAttribute": {
								"columnName": "kind",
								"value": "reachable_employee"
							}
						},
						"pipes": [ existWithSameAttribute, doesBelongToCurrentUser ]
					}
				},
				"relationshipName": "user",
				"typeName": "user",
				"validator": exists
			}
		])

		return makeResourceDocumentRules("employee_schedule", attributes, {
			"extraDataQueries": relationships,
			"isNew": true,
			"postAttributeValidation": {
				"constraints": {
					"uniqueEmployeeSchedule": {
						"userIDPointer": "data.relationships.user.data.id"
					}
				},
				"pipes": [ uniqueEmployeeSchedule ]
			}
		})
	}

	get manager(): BaseManagerClass { return UserManager }

	async handle(request: AuthenticatedIDRequest, unusedResponse: Response)
	: Promise<CreatedResponseInfo> {
		const manager = new EmployeeScheduleManager(request)
		const { data } = request.body as EmployeeScheduleDocument<"create">
		const { attributes, relationships } = data

		const document = await manager.create({
			...attributes,
			"userID": Number(relationships.user.data.id)
		})

		Log.success("controller", "successfully created the employee schedule of the user")

		return new CreatedResponseInfo(document)
	}
}
