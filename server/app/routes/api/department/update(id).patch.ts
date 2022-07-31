import { Request, Response } from "!/types/dependent"
import type { BaseManagerClass } from "!/types/independent"

import Policy from "!/bases/policy"
import DepartmentManager from "%/managers/department"
import { UPDATE } from "$/permissions/department_combinations"
import NoContentResponseInfo from "!/response_infos/no_content"
import BoundJSONController from "!/common_controllers/bound_json_controller"
import { department as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"

export default class extends BoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			UPDATE
		])
	}

	get bodyValidationRules(): object {
		return {
			"data": [ "required", "object" ],
			"data.type": [ "required", "string", "equals:department" ],
			"data.id": [ "required", "numeric" ],
			"data.attributes": [ "required", "object" ],
			"data.attributes.fullName": [
				"required",
				"string",
				"minLength:10",
				"regex:([A-Z][a-zA-Z]+ )+[A-Z][a-zA-Z]+$",
				[ "unique", DepartmentManager, "fullName", "data.id" ]
			],
			"data.attributes.acronym": [
				"required",
				"string",
				"minLength:2",
				"regex:([A-Z][a-z]*)+",
				"acronym:data.attributes.fullName",
				[ "unique", DepartmentManager, "acronym", "data.id" ]
			],
			"data.attributes.mayAdmit": [ "required", "boolean" ]
		}
	}

	get manager(): BaseManagerClass { return DepartmentManager }

	async handle(request: Request, response: Response): Promise<NoContentResponseInfo> {
		const manager = new DepartmentManager(request.transaction, request.cache)
		const id = +request.params.id
		const affectedCount = await manager.update(id, request.body.data.attributes)

		return new NoContentResponseInfo()
	}
}
