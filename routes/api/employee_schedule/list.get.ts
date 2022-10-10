import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { EmployeeScheduleQueryParameters } from "$/types/query"
import { DayValues } from "$/types/database"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import ListResponse from "!/response_infos/list"
import QueryController from "!/controllers/query"
import EmployeeScheduleManager from "%/managers/employee_schedule"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import convertTimeToMinutes from "$/object/convert_time_to_minutes"

import makeIDRules from "!/rule_sets/make_id"
import object from "!/validators/base/object"
import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import exists from "!/validators/manager/exists"
import makeListRules from "!/rule_sets/make_list"
import required from "!/validators/base/required"
import nullable from "!/validators/base/nullable"
import range from "!/validators/comparison/range"
import oneOf from "!/validators/comparison/one-of"
import skipAsterisk from "!/validators/comparison/skip_asterisk"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return CommonMiddlewareList.knownOnlyPolicy
	}

	makeQueryRuleGenerator(unusedRequest: Request): FieldRules {
		return makeListRules(
			EmployeeScheduleManager,
			{
				...makeIDRules({
					"IDName": "user",
					"mustCast": true,
					"postRules": {
						"constraints": {
							"manager": {
								"className": UserManager,
								"columnName": "id"
							}
						},
						"pipes": [ exists ]
					}
				}),
				"day": {
					"constraints": {
						"nullable": {
							"defaultValue": "*"
						},
						"oneOf": {
							"values": [ ...DayValues ]
						}
					},
					"pipes": [ nullable, skipAsterisk, string, oneOf ]
				},
				"employeeScheduleRange": {
					"constraints": {
						"nullable": {
							"defaultValue": "*"
						},
						"object": {
							"end": {
								"constraints": {
									"range": {
										"maximum": convertTimeToMinutes("23:59"),
										"minimum": convertTimeToMinutes("00:01")
									}
								},
								"pipes": [ required, integer, range ]
							},
							"start": {
								"constraints": {
									"range": {
										"maximum": convertTimeToMinutes("23:58"),
										"minimum": convertTimeToMinutes("00:00")
									}
								},
								"pipes": [ required, integer, range ]
							}
						}
					},
					"pipes": [ nullable, skipAsterisk, object ]
				}
			}
		)
	}

	async handle(request: Request, unusedResponse: Response): Promise<ListResponse> {
		const constraints = { ...request.query } as EmployeeScheduleQueryParameters<number>

		const manager = new EmployeeScheduleManager(request.transaction, request.cache)
		const roles = await manager.list(constraints)

		return new ListResponse(roles)
	}
}
