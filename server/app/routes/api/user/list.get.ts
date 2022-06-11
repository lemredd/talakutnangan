import { Criteria } from "%/types"
import { Request, Response } from "!/types/dependent"

import UserManager from "%/managers/user_manager"
import Controller from "!/bases/controller-like/controller"

interface WithQuery {
	query: {
		criteria?: Criteria
	}
}

export default class extends Controller {
	get filePath(): string { return __filename }

	async handle(request: Request & WithQuery, response: Response): Promise<void> {
		const { criteria = null } = request.query
		const manager = new UserManager()
		const users = await manager.list(criteria)

		// TODO: Hide the signatures of users
		response.status(this.status.OK).json(users)
	}
}
