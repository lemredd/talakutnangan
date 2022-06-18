import type { AuthenticatedIDRequest, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import ModelBoundController from "!/common_controllers/model_bound_controller"

export default class extends ModelBoundController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		// TODO: Use policy to that authenticates overall level update
		return CommonMiddlewareList.knownOnlyPolicy
	}

	async handle(request: AuthenticatedIDRequest, response: Response): Promise<void> {
		const manager = new UserManager()
		const { id } = request.params
		// TODO: Generate password using student number or random
		const newPassword = "12345678"
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
