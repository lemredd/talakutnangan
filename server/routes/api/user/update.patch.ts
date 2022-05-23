import { EntityManager } from "typeorm"
import { Request, Response, NextFunction } from "express"

import User from "!/models/user"
import type { WithUser } from "!/types"

interface WithUpdate extends WithUser {
	params: {
		id: string
	},
	query: {
		confirm: boolean
	}
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
