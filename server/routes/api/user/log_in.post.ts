import { EntityManager } from "typeorm"
import { Request, Response } from "express"
import User from "!/models/user"

export default function(manager: EntityManager) {
	return async function(request: Request, response: Response) {
		response.writeHead(302, {
			Location: `/`
		})

		response.end()
	}
}
