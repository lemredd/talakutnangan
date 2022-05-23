import { v4 } from "uuid"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

export default function(_request: Request, response: Response) {
	response.writeHead(StatusCodes.MOVED_TEMPORARILY, {
		Location: `/chat/room/${v4()}`
	})

	response.end()
}
