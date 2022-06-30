import { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import DepartmentManager from "%/managers/department"
import { READ } from "$/permissions/department_combinations"
import QueryController from "!/common_controllers/query_controller"
import { department as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"

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

	async handle(request: Request, response: Response): Promise<void> {
		// TODO: Add limit to the constraints
		const constraints = { ...request.query }

		const manager = new DepartmentManager()
		const departments = await manager.list(constraints)

		response.status(this.status.OK).json(departments)
	}
}
