import { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import Validation from "!/bases/validation"

import DepartmentManager from "%/managers/department"
import { UPDATE } from "$/permissions/department_combinations"
import JSONController from "!/common_controllers/json_controller"
import { department as permissionGroup } from "$/permissions/permission_list"
import IDParameterValidation from "!/middlewares/authorization/id_parameter_validation"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			UPDATE
		])
	}

	get validations(): Validation[] {
		return [
			new IDParameterValidation([
				[ "id", DepartmentManager ]
			]),
			...super.validations
		]
	}

	get bodyValidationRules(): object {
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
				"acronym:data.attributes.fullName"
			],
			"data.attributes.mayAdmit": [ "required", "boolean" ]
		}
	}

	async handle(request: Request, response: Response): Promise<void> {
		const manager = new DepartmentManager()
		const { id, ...attributes } = request.body
		const affectedCount = await manager.update(id, attributes)

		response.status(affectedCount > 0? this.status.NO_CONTENT : this.status.NOT_MODIFIED)
	}
}
