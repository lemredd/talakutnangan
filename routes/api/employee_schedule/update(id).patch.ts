import type { FieldRules } from "!/types/validation"
import type { BaseManagerClass } from "!/types/independent"
import type { AuthenticatedIDRequest, Response } from "!/types/dependent"
import type { EmployeeScheduleDocument } from "$/types/documents/employee_schedule"

import { DayValues } from "$/types/database"

import Log from "$!/singletons/log"
import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import NoContentResponseInfo from "!/response_infos/no_content"
import EmployeeScheduleManager from "%/managers/employee_schedule"
import DoubleBoundJSONController from "!/controllers/double_bound_json"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import convertTimeToMinutes from "$/object/convert_time_to_minutes"

import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import required from "!/validators/base/required"
import range from "!/validators/comparison/range"
import oneOf from "!/validators/comparison/one-of"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"

export default class extends DoubleBoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		// TODO: Combine with permission-based policy
		return CommonMiddlewareList.reachableEmployeeOnlyPolicy
	}

	makeBodyRuleGenerator(unusedRequest: AuthenticatedIDRequest): FieldRules {
		/*
		 * TODO: Make validator if the schedule does not conflict with existing schedules
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

		return makeResourceDocumentRules("employee_schedule", attributes)
	}

	get manager(): BaseManagerClass { return UserManager }

	// TODO: Limit the updating to current user unless there is enough permission to update user info
	async handle(request: AuthenticatedIDRequest, unusedResponse: Response)
	: Promise<NoContentResponseInfo> {
		const manager = new EmployeeScheduleManager(request.transaction, request.cache)
		const { data } = request.body as EmployeeScheduleDocument<"update">
		const { id, attributes } = data

		await manager.update(Number(id), attributes)

		Log.success("controller", "successfully updated the employee schedule")

		return new NoContentResponseInfo()
	}
}
