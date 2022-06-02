import { v4 } from "uuid"
import { StatusCodes } from "http-status-codes"
import { Request, Response, NextFunction } from "express"

import Middleware from "!/routes/bases/middleware"
import type { RawURLInfo, WithUser }  from "!/types"
import GuestFormController from "!/routes/helpers/guest_form_controller"
import LocalLogInMiddleware from "!/middlewares/authentication/local_log_in"

export default class extends GuestFormController {
	getRawURLInfo(): RawURLInfo {
		return {
			baseURL: "log_in"
		}
	}

	getPremiddlewares(): Middleware[] {
		return [
			...super.getPremiddlewares(),
			new LocalLogInMiddleware()
		]
	}

	async handle(request: Request & WithUser, response: Response): Promise<void> {
		const user = request.user
		const token = v4()
		request.session.token = token
		response.status(StatusCodes.OK).json({
			email: user.email,
			token
		})
	}
}
