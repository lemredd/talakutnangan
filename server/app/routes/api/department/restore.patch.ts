import { AuthenticatedRequest, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import DepartmentManager from "%/managers/department"
import NoContentResponseInfo from "!/response_infos/no_content"
import JSONController from "!/common_controllers/json_controller"
import { ARCHIVE_AND_RESTORE } from "$/permissions/department_combinations"
import { department as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"

// TODO: Make a controller to check for existence of archived model
export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			ARCHIVE_AND_RESTORE
		])
	}

	get bodyValidationRules(): object {
		// TODO: Make a validator to check for archive models
		return {
			"data": [ "required", "array" ],
			"data.*": [ "required", "object" ],
			"data.*.type": [ "required", "string", "equals:department" ],
			"data.*.id": [ "required", "numeric" ]
		}
	}

	async handle(request: AuthenticatedRequest, response: Response): Promise<NoContentResponseInfo> {
		const manager = new DepartmentManager()

		// TODO: make a batch restore method
		// await manager.restore(+id)

		return new NoContentResponseInfo()
	}
}