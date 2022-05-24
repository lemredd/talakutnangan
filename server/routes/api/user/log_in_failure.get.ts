import { StatusCodes } from "http-status-codes"
import { Request, Response } from "express"

export default function() {
	return async function(request: Request, response: Response) {
		return response.status(StatusCodes.UNAUTHORIZED).json({
			email: [
				"User cannot be found"
			]
		})
	}
}
