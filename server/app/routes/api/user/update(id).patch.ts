import type { AuthenticatedIDRequest, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user_manager"
import ModelBoundController from "!/specialized/model_bound_controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default class extends ModelBoundController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		// TODO: Base the policy from permission
		return CommonMiddlewareList.knownOnlyPolicy
	}

	async handle(request: AuthenticatedIDRequest, response: Response): Promise<void> {
		const manager = new UserManager()
		const { id } = request.params

		// TODO: Update user details

		response.status(this.status.NOT_IMPLEMENTED)
	}
}
