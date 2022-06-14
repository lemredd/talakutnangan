import type { FindOptions } from "sequelize"

import type { Criteria } from "%/types/independent"

import Log from "!/helpers/log"

import Condition from "%/managers/helpers/condition"

/**
 * Sift any model which has a signature or verified e-mail based on criteria.
 */
export default function<T>(
	currentState: FindOptions<T>,
	constraints: { criteria?: Criteria, [key: string]: any }
): FindOptions<T> {
	const newState = { ...currentState }

	if (constraints.criteria !== undefined) {
		const condition = new Condition()

		switch(constraints.criteria) {
			case "incomplete":
				condition.or(
					(new Condition()).is("emailVerifiedAt", null),
					(new Condition()).is("signature", null)
				)
				break
			case "complete":
				condition.not("emailVerifiedAt", null)
				condition.not("signature", null)
				break
			case "all":
			default:
				break
		}

		newState.where = {
			...newState.where,
			...condition.build()
		}

		Log.trace("pipeline", "applied criteria filter")
	}

	return newState
}
