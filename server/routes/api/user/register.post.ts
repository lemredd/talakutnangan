import { v4 } from "uuid"
import passport from "passport"
import { EntityManager } from "typeorm"
import { Request, Response, NextFunction } from "express"

import User from "!/models/user"
import type { WithRegistration }  from "!/types"
import makeAutoLogInHandler from "!/routes/api/user/log_in.post"

export default function(manager: EntityManager) {
	return async function(
		request: Request & WithRegistration,
		response: Response,
		next: NextFunction
	) {
		// TODO: Add validation

		const { email, password } = request.body

		// TODO: Handle duplicated emails
		await manager.insert(User, {
			email,
			password
		})

		const handleAutoLogIn = makeAutoLogInHandler(manager)
		return await handleAutoLogIn(request, response, next)
	}
}
