import { v4 } from "uuid"

import { Request, Response } from "!/types/dependent"

import Middleware from "!/bases/middleware"
import GuestFormController from "!/app/routes/kinds/guest_form_controller-like/controller"
import LocalLogInMiddleware from "!/middlewares/authentication/local_log_in"

export default class extends GuestFormController {
	get filePath(): string { return __filename }

	get middlewares(): Middleware[] {
		return [
			...super.middlewares,
			new LocalLogInMiddleware()
		]
	}

	get bodyValidationRules(): object {
		return {
			email: [ "required", "string", "email", "maxLength:255" ],
			password: [ "required", "string", "minLength:8" ]
		}
	}

	async handle(request: Request, response: Response): Promise<void> {
		const user = request.user
		const token = v4()
		request.session.token = token
		response.status(this.status.OK).json({
			email: user.email,
			token
		})
	}
}
