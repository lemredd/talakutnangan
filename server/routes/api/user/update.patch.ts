import { ParsedQs } from "qs"
import { Request, Response } from "express"
import { ParamsDictionary } from "express-serve-static-core"

import UserManager from "%/managers/user_manager"

import type { RawRoute, WithUser } from "!/types"
import Controller from "!/routes/bases/controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import Middleware from "!/routes/bases/middleware"

interface ExpectedParameters extends ParamsDictionary {
	id: string
}

interface ExpectedQuery extends ParsedQs {
	confirm: string
}

export interface WithUpdate extends WithUser {
	params: ExpectedParameters,
	query: ExpectedQuery
}

export default class extends Controller {
	getRawRoute(): RawRoute {
		return {
			method: "patch",
			baseURL: "update/:id"
		}
	}

	getPremiddlewares(): Middleware[] {
		return [
			...super.getPremiddlewares(),
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
