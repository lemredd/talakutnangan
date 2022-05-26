import { v4 } from "uuid"
import { StatusCodes } from "http-status-codes"
import { Request, Response, NextFunction } from "express"

import type { WithUser }  from "!/types"
import GuestFormController from "!/routes/helpers/guest_form_controller"
import LocalLogInMiddleware from "!/middlewares/authentication/local_log_in"

export default class extends GuestFormController {
	constructor() {
		super("log_in")

		this.prependMiddleware(new LocalLogInMiddleware())
	}

	protected async handle(request: Request & WithUser, response: Response): Promise<void> {
		const user = request.user
		const token = v4()
		request.session.token = token
		response.status(StatusCodes.OK).json({
			email: user.email,
			token
		})
	}
}
