import { v4 } from "uuid"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import Controller from "!/helpers/controller"

export default class extends Controller {
	constructor() {
		super("get", "join")
	}

	protected async handle(request: Request, response: Response): Promise<void> {
		response.writeHead(StatusCodes.MOVED_TEMPORARILY, {
			Location: `/chat/room/${v4()}`
		})

		response.end()
	}
}
