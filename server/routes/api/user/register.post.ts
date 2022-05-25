import { v4 } from "uuid"
import passport from "passport"
import { EntityManager } from "typeorm"
import { Request, Response, NextFunction } from "express"

import User from "!/models/user"
import type { WithRegistration, WithPossibleUser }  from "!/types"

export default function(manager: EntityManager) {
	return async function(
		request: Request & WithRegistration & WithPossibleUser,
		response: Response,
		next: NextFunction
	) {
		// TODO: Add validation

		const { email, password } = request.body

		// TODO: Handle duplicated emails
		const user = manager.create(User, {
			email,
			password
		})

		manager.save(user)

		request.user = user
		return next()
	}
}
