import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { EmployeeScheduleQueryParameters } from "$/types/query"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import ListResponse from "!/response_infos/list"
import QueryController from "!/controllers/query"
import EmployeeScheduleManager from "%/managers/employee_schedule"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

import makeIDRules from "!/rule_sets/make_id"
import exists from "!/validators/manager/exists"
import makeListRules from "!/rule_sets/make_list"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return CommonMiddlewareList.knownOnlyPolicy
	}

	makeQueryRuleGenerator(unusedRequest: Request): FieldRules {
		return makeListRules(
			EmployeeScheduleManager,
			makeIDRules(true, "user", {
				"constraints": {
					"manager": {
						"className": UserManager,
						"columnName": "id"
					}
				},
				"pipes": [ exists ]
			})
		)
	}

	async handle(request: Request, unusedResponse: Response): Promise<ListResponse> {
		const constraints = { ...request.query } as EmployeeScheduleQueryParameters<number>

		const manager = new EmployeeScheduleManager(request.transaction, request.cache)
		const roles = await manager.list(constraints)

		return new ListResponse(roles)
	}
}
