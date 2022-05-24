import { v4 } from "uuid"
import passport from "passport"
import { EntityManager } from "typeorm"
import { StatusCodes } from "http-status-codes"
import { Request, Response, NextFunction } from "express"

import type { WithSession }  from "!/types"

export default function(manager: EntityManager) {
	return async function(request: Request & WithSession, response: Response, next: NextFunction) {
		passport.authenticate("local", function(error, user, info, status) {
			if (error) { return next(error) }
			if (!user) {
				return response.status(StatusCodes.UNAUTHORIZED).json({
					email: [
						"User cannot be found"
					]
				})
			}

			const token = v4()
			request.session.token = token

			return response.status(StatusCodes.OK).json({
				token
			})
		})(request, response, next)
	}
}
