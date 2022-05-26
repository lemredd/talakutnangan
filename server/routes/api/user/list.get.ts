import { EntityManager, IsNull, Not, FindOptionsWhere } from "typeorm"
import { StatusCodes } from "http-status-codes"
import { Request, Response } from "express"

import User from "!/models/user"
import Controller from "!/helpers/controller"

interface WithQuery {
	query: {
		criteria?: "incomplete" | "unadmitted" | "admitted"
	}
}

export default class extends Controller {
	constructor() {
		super("get", "list")
	}

	async handle(request: Request & WithQuery, response: Response): Promise<void> {
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

		const users = await this.environment.manager.findBy(User, findOptionsWhere)

		// TODO: Hide the signatures of users
		response.status(StatusCodes.OK).json(users)
	}
}
