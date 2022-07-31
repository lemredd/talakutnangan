import type { FieldRules } from "!/types/independent"
import type { FieldRulesMaker } from "!/types/hybrid"
import { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import DepartmentManager from "%/managers/department"
import { READ } from "$/permissions/department_combinations"
import QueryController from "!/common_controllers/query_controller"
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
		// TODO: make a validator to skip "*" character
		return (request: Request): FieldRules => makeListRules(DepartmentManager, {})
	}

	async handle(request: Request, response: Response): Promise<void> {
		// TODO: Add limit to the constraints
		const constraints = { ...request.query }

		const manager = new DepartmentManager(request.transaction, request.cache)
		const departments = await manager.list(constraints)

		response.status(this.status.OK).json(departments)
	}
}
