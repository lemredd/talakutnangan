import type { FieldRules } from "!/types/validation"
import type { BaseManagerClass } from "!/types/dependent"
import type { AuthenticatedIDRequest, Response } from "!/types/dependent"
import type { EmployeeScheduleDocument } from "$/types/documents/employee_schedule"

import { DayValues } from "$/types/database"

import Log from "$!/singletons/log"
import UserManager from "%/managers/user"
import Merger from "!/middlewares/miscellaneous/merger"
import NoContentResponseInfo from "!/response_infos/no_content"
import EmployeeScheduleManager from "%/managers/employee_schedule"
import convertTimeToMinutes from "$/object/convert_time_to_minutes"
import DoubleBoundJSONController from "!/controllers/double_bound_json"

import Policy from "!/bases/policy"
import PermissionBasedPolicy from "!/policies/permission-based"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import BelongsToCurrentUserPolicy from "!/policies/belongs_to_current_user"
import { user as permissionGroup } from "$/permissions/permission_list"
import {
	UPDATE_OWN_DATA,
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import exists from "!/validators/manager/exists"
import required from "!/validators/base/required"
import range from "!/validators/comparison/range"
import oneOf from "!/validators/comparison/one-of"
import makeRelationshipRules from "!/rule_sets/make_relationships"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"
import uniqueEmployeeSchedule from "!/validators/date/unique_employee_schedule"
import existWithSameAttribute from "!/validators/manager/exist_with_same_attribute"

export default class extends DoubleBoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new Merger([
			CommonMiddlewareList.reachableEmployeeOnlyPolicy,
			new PermissionBasedPolicy(permissionGroup, [
				UPDATE_OWN_DATA,
				UPDATE_ANYONE_ON_OWN_DEPARTMENT,
				UPDATE_ANYONE_ON_ALL_DEPARTMENTS
			]),
			new BelongsToCurrentUserPolicy(this.manager, {
				"bypassNecessarilyWith": {
					"combinations": [
						UPDATE_ANYONE_ON_OWN_DEPARTMENT,
						UPDATE_ANYONE_ON_ALL_DEPARTMENTS
					],
					"group": permissionGroup
				}
			})
		]) as unknown as Policy
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
					"range": {
						"maximum": convertTimeToMinutes("23:59"),
						"minimum": convertTimeToMinutes("00:01")
					}
				},
				"pipes": [ required, integer, range ]
			},
			"scheduleStart": {
				"constraints": {
					"range": {
						"maximum": convertTimeToMinutes("23:58"),
						"minimum": convertTimeToMinutes("00:00")
					}
				},
				"pipes": [ required, integer, range ]
			}
		}

		const relationships: FieldRules = makeRelationshipRules([
			{
				"ClassName": UserManager,
				"isArray": false,
				"options": {
					"postIDRules": {
						"constraints": {
							"sameAttribute": {
								"columnName": "kind",
								"value": "reachable_employee"
							}
						},
						"pipes": [ existWithSameAttribute ]
					}
				},
				"relationshipName": "user",
				"typeName": "user",
				"validator": exists
			}
		])

		return makeResourceDocumentRules("employee_schedule", attributes, {
			"extraDataQueries": relationships,
			"postAttributeValidation": {
				"constraints": {
					"uniqueEmployeeSchedule": {
						"employeeScheduleIDPointer": "data.id",
						"userIDPointer": "data.relationships.user.data.id"
					}
				},
				"pipes": [ uniqueEmployeeSchedule ]
			}
		})
	}

	get manager(): BaseManagerClass { return UserManager }

	async handle(request: AuthenticatedIDRequest, unusedResponse: Response)
	: Promise<NoContentResponseInfo> {
		const manager = new EmployeeScheduleManager(request)
		const { data } = request.body as EmployeeScheduleDocument<"update">
		const { id, attributes } = data

		await manager.update(Number(id), attributes)

		Log.success("controller", "successfully updated the employee schedule")

		return new NoContentResponseInfo()
	}
}
