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
		// TODO: Think of the minimum length of full name.
		return {
			"data": [ "required", "object" ],
			"data.type": [ "required", "string", "equals:department" ],
			"data.attributes": [ "required", "object" ],
			"data.attributes.fullName": [
				"required",
				"string",
				"minLength:10",
				"regex:([A-Z][a-zA-Z]+ )+[A-Z][a-zA-Z]+$",
				[ "notExists", DepartmentManager, "fullName" ]
			],
			"data.attributes.acronym": [
				"required",
				"string",
				"minLength:2",
				"regex:([A-Z][a-z]*)+",
				"acronym:data.attributes.fullName",
				[ "notExists", DepartmentManager, "acronym" ]
			],
			"data.attributes.mayAdmit": [ "required", "boolean" ]
		}
	}

	async handle(request: Request, response: Response): Promise<void> {
		const manager = new DepartmentManager()
		const departmentInfo = await manager.create(request.body.data.attributes)

		response.status(this.status.NO_CONTENT)
	}
}
