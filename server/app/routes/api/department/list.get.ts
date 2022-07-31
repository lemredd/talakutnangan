import type { FieldRules } from "!/types/independent"
import type { FieldRulesMaker } from "!/types/hybrid"
import { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import ListResponse from "!/response_infos/list"
import DepartmentManager from "%/managers/department"
import QueryController from "!/common_controllers/query_controller"

import { READ } from "$/permissions/department_combinations"
import { department as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"

import makeListRules from "!/app/rule_sets/make_list"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ
		])
	}

	get queryValidationRules(): object {
		// TODO: Validate common query
		return {}
	}

	makeQueryRuleGenerator(): FieldRulesMaker {
		return (request: Request): FieldRules => makeListRules(DepartmentManager, {})
	}

	async handle(request: Request, response: Response): Promise<ListResponse> {
		const constraints = { ...request.query }

		const manager = new DepartmentManager(request.transaction, request.cache)
		const departments = await manager.list(constraints)

		return new ListResponse(departments)
	}
}
