import type { AuthenticatedIDRequest, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import { user as permissionGroup } from "$/permissions/permission_list"
import ModelBoundController from "!/common_controllers/model_bound_controller"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"
import {
	UPDATE_OWN_DATA,
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

export default class extends ModelBoundController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			UPDATE_OWN_DATA,
			UPDATE_ANYONE_ON_OWN_DEPARTMENT,
			UPDATE_ANYONE_ON_ALL_DEPARTMENTS
		])
	}

	async handle(request: AuthenticatedIDRequest, response: Response): Promise<void> {
		const manager = new UserManager()
		const { id } = request.params

		// TODO: Update user details

		response.status(this.status.NOT_IMPLEMENTED)
	}
}
