import { EntityManager } from "typeorm"
import { Request, Response } from "express"
import { ParamsDictionary } from "express-serve-static-core"
import { ParsedQs } from "qs"

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
		const { confirm = false } = request.query

		// TODO: Check if the user can admit
		if (confirm) {
			await manager.update(
				User,
				// TODO: Check if within the department
				{ id, admitted_at: null },
				{ admitted_at: new Date() }
			)

			response.status(200)
		} else {
			// TODO: Update user details
			response.status(500)
		}
	}
}
