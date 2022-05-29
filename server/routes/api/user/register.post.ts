import { v4 } from "uuid"
import { EntityManager } from "typeorm"
import { Request, Response } from "express"

import User from "%/models/user"
import type { WithRegistration, WithPossibleUser }  from "!/types"
import GuestFormController from "!/routes/helpers/guest_form_controller"
import LogInController from "!/routes/api/user/log_in.post"

export default class extends GuestFormController {
	constructor() {
		super("register")

		this.appendMiddleware(new LogInController())
	}

	async handle(
		request: Request & WithRegistration & WithPossibleUser,
		response: Response
	): Promise<void> {
		// TODO: Add validation

		const { email, password } = request.body

		// TODO: Handle duplicated emails
		const user = this.environment.manager.create(User, {
			email,
			password
		})

		await this.environment.manager.save(user)

		request.user = user
	}
}
