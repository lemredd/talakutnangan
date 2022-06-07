import type { IDParameter, Query, Request as BaseRequest, Response } from "!/types/dependent"

import Controller from "!/bases/controller"
import Middleware from "!/bases/middleware"
import UserManager from "%/managers/user_manager"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

interface ExpectedQuery extends Query {
	confirm: string
}

interface WithUpdate {
	params: IDParameter,
	query: ExpectedQuery
}

export type Request = BaseRequest & WithUpdate

export default class extends Controller {
	get filePath(): string { return __filename }

	get middlewares(): Middleware[] {
		return [
			...super.middlewares,
			CommonMiddlewareList.basicAuthenticatedPageGuard
		]
	}

	async handle(request: Request, response: Response): Promise<void> {
		const manager = new UserManager()
		const { id } = request.params
		const { confirm = "0" } = request.query

		// TODO: Make parameter validation

		// TODO: Check if the user can admit
		if (confirm) {
			// TODO: Check if within the department
			const affectedCount = await manager.admit(+id, true)

			response.status(affectedCount > 0 ? this.status.ACCEPTED : this.status.NOT_MODIFIED).end()

			// ?: This code does not work for some reason. This is why manual checking is needed
			// await manager.update(
			// 	User,
			// 	{ id: +id, admittedAt: null },
			// 	{ admittedAt: (new Date()).toISOString() }
			// )
		} else {
			// TODO: Update user details
			response.status(this.status.INTERNAL_SERVER_ERROR)
		}
	}
}
