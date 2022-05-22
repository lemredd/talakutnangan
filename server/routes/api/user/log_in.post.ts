import { EntityManager } from "typeorm"
import { Request, Response, NextFunction } from "express"
import passport from "passport"
import { v4 } from "uuid"
import type { WithSession }  from "!/types"

export default function(manager: EntityManager) {
	return async function(request: Request & WithSession, response: Response, next: NextFunction) {
		passport.authenticate("local", function(error, user, info, status) {
			if (error) { return next(error) }
			if (!user) {
				return response.status(401).json({
					email: [
						"User cannot be found"
					]
				})
			}

			const token = v4()
			request.session.token = token

			return response.status(200).json({
				token
			})
		})(request, response, next)
	}
}
