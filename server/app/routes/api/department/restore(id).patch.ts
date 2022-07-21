import { AuthenticatedIDRequest, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import DepartmentManager from "%/managers/department"
import NoContentResponseInfo from "!/response_infos/no_content"
import { ARCHIVE_AND_RESTORE } from "$/permissions/department_combinations"
import { department as permissionGroup } from "$/permissions/permission_list"
import ModelBoundController from "!/common_controllers/model_bound_controller"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"

// TODO: Make a controller to check for existence of archived model
export default class extends ModelBoundController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			ARCHIVE_AND_RESTORE
		])
	}

	async handle(request: AuthenticatedIDRequest, response: Response)
	: Promise<NoContentResponseInfo> {
		const { id } = request.params
		const manager = new DepartmentManager()
		await manager.restore(+id)

		return new NoContentResponseInfo()
	}

	get manager(): new() => DepartmentManager {
		return DepartmentManager
	}
}
