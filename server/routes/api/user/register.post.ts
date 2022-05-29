import { Request, Response } from "express"

import User from "%/models/user"
import Middleware from "!/helpers/middleware"
import LogInController from "!/routes/api/user/log_in.post"
import GuestFormController from "!/routes/helpers/guest_form_controller"
import type { WithRegistration, WithPossibleUser, RawURLInfo }  from "!/types"

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

		const { email, password } = request.body

		// TODO: Handle duplicated emails
		const user = this.manager.create(User, {
			email,
			password
		})

		await this.manager.save(user)

		request.user = user
	}

	getPostmiddlewares(): Middleware[] {
		return [
			...super.getPostmiddlewares(),
			new LogInController()
		]
	}
}
