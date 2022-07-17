import type { UserProfile } from "$/types/common_front-end"
import type { AuthenticatedIDRequest, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import deserialize from "$/helpers/deserialize"
import makeDefaultPassword from "!/helpers/make_default_password"
import { RESET_PASSWORD } from "$/permissions/user_combinations"
import { user as permissionGroup } from "$/permissions/permission_list"
import ModelBoundController from "!/common_controllers/model_bound_controller"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"

export default class extends ModelBoundController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			RESET_PASSWORD
		])
	}

	async handle(request: AuthenticatedIDRequest, response: Response): Promise<void> {
		const manager = new UserManager()
		const id = +request.params.id
		const userProfile = deserialize(await manager.findWithID(id)) as UserProfile
		const newPassword = makeDefaultPassword(userProfile)
		const isSuccess = await manager.resetPassword(+id, newPassword)

		if (isSuccess) {
			response.status(this.status.NO_CONTENT).end()
		} else {
			response.status(this.status.INTERNAL_SERVER_ERROR).json({
				"errors": [
					"User was not found or there is a problem with the database."
				]
			})
		}
	}
}
