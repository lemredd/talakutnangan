import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { CommonQueryParameters } from "$/types/query"

import Policy from "!/bases/policy"
import ListResponse from "!/response_infos/list"
import DepartmentManager from "%/managers/department"
import QueryController from "!/common_controllers/query_controller"

import { READ } from "$/permissions/department_combinations"
import { department as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/policies/permission-based"

import makeListRules from "!/rule_sets/make_list"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ
		])
	}

	makeQueryRuleGenerator(request: Request): FieldRules {
		return makeListRules(DepartmentManager, {})
	}

	async handle(request: Request, response: Response): Promise<ListResponse> {
		const constraints = { ...request.query }

		const manager = new DepartmentManager(request.transaction, request.cache)
		const departments = await manager.list(constraints as CommonQueryParameters)

		return new ListResponse(departments)
	}
}
