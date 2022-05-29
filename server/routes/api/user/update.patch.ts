import { ParsedQs } from "qs"
import { Request, Response } from "express"
import { IsNull } from "typeorm"
import { StatusCodes } from "http-status-codes"
import { ParamsDictionary } from "express-serve-static-core"

import User from "%/models/user"
import type { RawRoute, WithUser } from "!/types"
import Controller from "!/helpers/controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import Middleware from "!/helpers/middleware"

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
		const { id } = request.params
		const { confirm = "0" } = request.query

		// TODO: Make parameter validation

		// TODO: Check if the user can admit
		if (confirm) {
			// TODO: Check if within the department
			const { affected } = await this.manager.update(User, {
				id,
				admittedAt: IsNull()
			}, {
				admittedAt: new Date()
			})

			response.status(affected > 0 ? StatusCodes.ACCEPTED : StatusCodes.NOT_MODIFIED).end()

			// ?: This code does not work for some reason. This is why manual checking is needed
			// await manager.update(
			// 	User,
			// 	{ id: +id, admittedAt: null },
			// 	{ admittedAt: (new Date()).toISOString() }
			// )
		} else {
			// TODO: Update user details
			response.status(StatusCodes.INTERNAL_SERVER_ERROR)
		}
	}
}
