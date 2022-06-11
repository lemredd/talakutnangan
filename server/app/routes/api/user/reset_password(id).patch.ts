import type { IDParameter, Request as BaseRequest, Response } from "!/types/dependent"

import Controller from "!/bases/controller"
import Middleware from "!/bases/middleware"
import UserManager from "%/managers/user_manager"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

interface WithUpdate {
	params: IDParameter
}

export type Request = BaseRequest & WithUpdate

export default class extends Controller {
	get filePath(): string { return __filename }

	get middlewares(): Middleware[] {
		return [
			...super.middlewares,
			// TODO: Use policy to that authenticates overall level update
			CommonMiddlewareList.knownOnlyPolicy
		]
	}

	async handle(request: Request, response: Response): Promise<void> {
		const manager = new UserManager()
		// TODO: Make parameter validation
		const { id } = request.params
		// TODO: Generate password using student number or random
		const newPassword = "12345678"
		const isSuccess = await manager.resetPassword(+id, newPassword)

		if (isSuccess) {
			response.status(this.status.NO_CONTENT).end()
		} else {
			response.status(this.status.INSUFFICIENT_STORAGE).json({
				"errors": [
					"User was not found or there is a problem with the database."
				]
			})
		}
	}
}
