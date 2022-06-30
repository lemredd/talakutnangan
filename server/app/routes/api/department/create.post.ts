import { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import DepartmentManager from "%/managers/department"
import { CREATE } from "$/permissions/department_combinations"
import JSONController from "!/common_controllers/json_controller"
import { department as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			CREATE
		])
	}

	get bodyValidationRules(): object {
		// TODO: Create custom validator for acronym
		return {
			acronym: [ "required", "string" ],
			fullName: [ "required", "string" ],
			mayAdmit: [ "required", "boolean" ]
		}
	}

	async handle(request: Request, response: Response): Promise<void> {
		const manager = new DepartmentManager()
		const departmentInfo = await manager.create(request.body)

		response.status(this.status.OK).json(departmentInfo)
	}
}
