import { AuthenticatedIDRequest, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import RoleManager from "%/managers/role"
import { ARCHIVE_AND_RESTORE } from "$/permissions/role_combinations"
import { role as permissionGroup } from "$/permissions/permission_list"
import ModelBoundController from "!/common_controllers/model_bound_controller"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"

export default class extends ModelBoundController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			ARCHIVE_AND_RESTORE
		])
	}

	async handle(request: AuthenticatedIDRequest, response: Response): Promise<void> {
		const { id } = request.params
		const manager = new RoleManager()
		const deleteCount = await manager.archive(+id)

		response.status(deleteCount > 0? this.status.NO_CONTENT : this.status.NOT_MODIFIED)
	}
}
