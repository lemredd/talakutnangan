import { EntityManager } from "typeorm"
import { Request, Response } from "express"
import User from "!/models/user"
// import useSession from "~/server/auth/useSession"

export default function(manager: EntityManager) {
	return async function(_request: Request, response: Response) {
		// const { currentSession, regenerateToken, saveSession } = useSession(event)
		// const { body } = await useBody(event)
		const body = { email: "sample@gmail.com" }

		// TODO: Validation

		const user = await manager.findOne(User, { where: body })

		if (user === null) {
			response.statusCode = 401
			// saveSession()
			response.end()
		} else {
			// currentSession.email = user.email
			response.statusCode = 200
			// regenerateToken()
			// saveSession()
			response.end()
		}

})
