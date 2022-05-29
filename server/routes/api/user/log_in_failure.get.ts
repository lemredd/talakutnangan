import { StatusCodes } from "http-status-codes"
import { Request, Response } from "express"

import Controller from "!/helpers/controller"
import { RawRoute } from "!/types"

export default class extends Controller {
	getRawRoute(): RawRoute {
		return {
			method: "get",
			baseURL: "log_in_failure"
		}
	}

	async handle(request: Request, response: Response): Promise<void> {
		response.status(StatusCodes.UNAUTHORIZED).json({
			email: [
				"User cannot be found"
			]
		})
	}
}
