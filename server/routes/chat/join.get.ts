import { v4 } from "uuid"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { RawRoute } from "!/types"
import Controller from "!/routes/bases/controller"

export default class extends Controller {
	getRawRoute(): RawRoute {
		return {
			method: "get",
			baseURL: "join"
		}
	}

	async handle(request: Request, response: Response): Promise<void> {
		response.writeHead(StatusCodes.MOVED_TEMPORARILY, {
			Location: `/chat/room/${v4()}`
		})

		response.end()
	}
}
