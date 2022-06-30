import { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import DepartmentManager from "%/managers/department"
import { UPDATE } from "$/permissions/department_combinations"
import JSONController from "!/common_controllers/json_controller"
import { department as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			UPDATE
		])
	}

	get bodyValidationRules(): object {
		// TODO: Think of the minimum length of full name.
		return {
			fullName: [ "required", "string", "minLength:10", "regex:([A-Z][a-z]+ )+[A-Z][a-z]+$" ],
			acronym: [
				"required",
				"string",
				"minLength:2",
				"regex:([A-Z][a-z]*)+",
				"acronym:fullName"
			],
			mayAdmit: [ "required", "boolean" ]
		}
	}

	async handle(request: Request, response: Response): Promise<void> {
		const manager = new DepartmentManager()
		const { id, ...attributes } = request.body
		const affectedCount = await manager.update(id, attributes)

		response.status(affectedCount > 0? this.status.NO_CONTENT : this.status.NOT_MODIFIED)
	}
}
