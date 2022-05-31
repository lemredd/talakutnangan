import { Request, Response } from "express"

import UserManager from "%/managers/user_manager"
import Middleware from "!/helpers/middleware"
import LogInController from "!/routes/api/user/log_in.post"
import GuestFormController from "!/routes/helpers/guest_form_controller"
import { WithRegistration, WithPossibleUser, RawURLInfo, UserKind }  from "!/types"

export default class extends GuestFormController {
	getRawURLInfo(): RawURLInfo {
		return {
			baseURL: "register"
		}
	}

	async handle(
		request: Request & WithRegistration & WithPossibleUser,
		response: Response
	): Promise<void> {
		// TODO: Add validation
		const manager = new UserManager()
		const { email, password } = request.body

		// TODO: Handle duplicated emails
		const user = await manager.create({
			email,
			password,
			kind: UserKind.Student
		})

		request.user = user
	}

	getPostmiddlewares(): Middleware[] {
		return [
			...super.getPostmiddlewares(),
			new LogInController()
		]
	}
}
