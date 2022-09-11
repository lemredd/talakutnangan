import type { FieldRules, Rules } from "!/types/validation"
import type { BaseManagerClass } from "!/types/independent"
import type { AuthenticatedIDRequest, Response } from "!/types/dependent"
import type { EmployeeScheduleDocument } from "$/types/documents/employee_schedule"

import { DayValues } from "$/types/database"

import Log from "$!/singletons/log"
import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import CreatedResponseInfo from "!/response_infos/created"
import EmployeeScheduleManager from "%/managers/employee_schedule"
import JSONController from "!/controllers/json"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import convertTimeToMinutes from "$/object/convert_time_to_minutes"

import object from "!/validators/base/object"
import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import exists from "!/validators/manager/exists"
import required from "!/validators/base/required"
import range from "!/validators/comparison/range"
import oneOf from "!/validators/comparison/one-of"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"
import makeResourceIdentifierRules from "!/rule_sets/make_resource_identifier"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return CommonMiddlewareList.employeeSchedulePolicy
	}

	makeBodyRuleGenerator(unusedRequest: AuthenticatedIDRequest): FieldRules {
		/*
		 * TODO: Make validator if the schedule does not conflict with existing schedules
		 * TODO: Make validator if the schedule start is less than schedule end
		 * TODO: Make validator if the user is has a kind column with a value of "reachable_employee"
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

		const relationships: Rules = {
			"constraints": {
				"object": {
					"user": {
						"constraints": {
							"object": {
								"data": {
									"constraints": {
										"object": makeResourceIdentifierRules("user", exists, UserManager)
									},
									"pipes": [ required, object ]
								}
							}
						},
						"pipes": [ required, object ]
					}
				}
			},
			"pipes": [ required, object ]
		}

		return makeResourceDocumentRules("employee_schedule", attributes, {
			"extraDataQueries": { relationships },
			"isNew": true
		})
	}

	get manager(): BaseManagerClass { return UserManager }

	// TODO: Limit the creation to current user unless there is enough permission to update user info
	async handle(request: AuthenticatedIDRequest, unusedResponse: Response)
	: Promise<CreatedResponseInfo> {
		const manager = new EmployeeScheduleManager(request.transaction, request.cache)
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
