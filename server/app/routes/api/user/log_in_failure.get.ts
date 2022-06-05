import { StatusCodes } from "http-status-codes"
import { Request, Response } from "express"

import Controller from "!/bases/controller"
import { RawRoute } from "!/types"

export default class extends Controller {
	get filePath(): string { return __filename }

	async handle(request: Request, response: Response): Promise<void> {
		response.status(StatusCodes.UNAUTHORIZED).json({
			email: [
				"User cannot be found"
			]
		})
	}
}
