import { ParsedQs } from "qs"
import { EntityManager } from "typeorm"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { ParamsDictionary } from "express-serve-static-core"

import User from "!/models/user"
import type { WithUser } from "!/types"

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

export default function(manager: EntityManager) {
	return async function(request: Request & WithUpdate, response: Response) {
		const { id } = request.params
		const { confirm = "0" } = request.query

		// TODO: Make parameter validation

		// TODO: Check if the user can admit
		if (confirm) {
			// TODO: Check if within the department
			const user = await manager.findOneBy(User, { id: +id })

			if (user === null || user.admitted_at !== null) {
				return response.status(StatusCodes.NOT_MODIFIED)
			}

			user.admitted_at = new Date()
			await manager.save(user)

			return response.status(StatusCodes.ACCEPTED )

			// ?: This code does not work for some reason. This is why manual checking is needed
			// await manager.update(
			// 	User,
			// 	{ id: +id, admitted_at: null },
			// 	{ admitted_at: (new Date()).toISOString() }
			// )
		} else {
			// TODO: Update user details
			return response.status(StatusCodes.INTERNAL_SERVER_ERROR)
		}
	}
}
