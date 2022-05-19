import { v4 } from "uuid"
import { Request, Response } from "express"

export default function(_request: Request, response: Response) {
	response.writeHead(302, {
		Location: `/chat/room/${v4()}`
	})

	response.end()
}
