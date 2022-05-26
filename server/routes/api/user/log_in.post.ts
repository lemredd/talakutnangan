import { v4 } from "uuid"
import { EntityManager } from "typeorm"
import { StatusCodes } from "http-status-codes"
import { Request, Response, NextFunction } from "express"

import type { WithUser }  from "!/types"

export default function(manager: EntityManager) {
	return async function(request: Request & WithUser, response: Response, next: NextFunction) {
		const user = request.user
		const token = v4()
		request.session.token = token
		return response.status(StatusCodes.OK).json({
			email: user.email,
			token
		})
	}
}
