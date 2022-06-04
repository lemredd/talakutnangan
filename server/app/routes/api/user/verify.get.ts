import { Request, Response } from "express"

import UserManager from "%/managers/user_manager"
import Controller from "!/bases/controller"
import { RawRoute } from "!/types"

interface WithQuery {
	query: {
		to: string
	}
}

export default class extends Controller {
	getRawRoute(): RawRoute {
		return {
			method: "get",
			baseURL: "verify"
		}
	}

	async handle(request: Request & WithQuery, response: Response): Promise<void> {
		// TODO: Validate query parameter
		const { to } = request.query
		const manager = new UserManager()
		const verifiedCount = await manager.verify(to)

		response.status(verifiedCount > 0 ? this.status.ACCEPTED : this.status.NOT_MODIFIED).end()
	}
}
