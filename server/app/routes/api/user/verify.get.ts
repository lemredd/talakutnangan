import { Request as BaseRequest, Response, Query } from "!/types/dependent"

import UserManager from "%/managers/user_manager"
import Controller from "!/bases/controller-like/controller"

interface RequiredQuery extends Query {
	to: string
}

interface WithQuery {
	query: RequiredQuery
}

type Request = BaseRequest & WithQuery

export default class extends Controller {
	get filePath(): string { return __filename }

	async handle(request: Request & WithQuery, response: Response): Promise<void> {
		// TODO: Validate query parameter
		const { to } = request.query
		const manager = new UserManager()
		const verifiedCount = await manager.verify(to)

		response.status(verifiedCount > 0 ? this.status.ACCEPTED : this.status.NOT_MODIFIED).end()
	}
}
