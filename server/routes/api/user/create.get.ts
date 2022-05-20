import { EntityManager } from "typeorm"
import { Request, Response } from "express"
import User from "!/model/user"

export default function(manager: EntityManager) {
	return async function(_request: Request, response: Response) {
		await manager.upsert(User, [
			{
				email: "sample@gmail.com"
			}
		], [ "email" ])
		response.statusCode = 201
		response.end()
	}
}
