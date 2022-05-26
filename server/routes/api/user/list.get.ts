import { EntityManager, IsNull, Not, FindOptionsWhere } from "typeorm"
import { StatusCodes } from "http-status-codes"
import { Request, Response, NextFunction } from "express"
import User from "!/models/user"

interface WithQuery {
	query: {
		criteria?: "incomplete" | "unadmitted" | "admitted"
	}
}

export default function(manager: EntityManager) {
	return async function(request: Request & WithQuery, response: Response, next: NextFunction) {
		const { criteria = null } = request.query
		const findOptionsWhere: FindOptionsWhere<User> = {}

		switch(criteria) {
			case "admitted": { // Complete profile and admitted
				// TODO
				break
			}
			case "unadmitted": { // Complete profile but not admitted
				// TODO: Add constraints to other fields to consider it is a complete profile
				findOptionsWhere.emailVerifiedAt = Not(IsNull()),
				findOptionsWhere.admittedAt = IsNull()

				break
			}
			case "incomplete": { // Incomplete profile
				// TODO
				break
			}
			default: // All users
		}

		const users = await manager.findBy(User, findOptionsWhere)

		// TODO: Hide the signatures of users
		response.status(StatusCodes.OK).json(users)
	}
}
