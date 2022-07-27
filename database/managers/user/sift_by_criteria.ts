import type { CriteriaFilter } from "$/types/database"
import type { FindOptions } from "%/types/dependent"

import Log from "$!/singletons/log"

import Condition from "%/managers/helpers/condition"

/**
 * Sift any model which has a signature or verified e-mail based on criteria.
 */
export default function<T>(
	currentState: FindOptions<T>,
	constraints: CriteriaFilter
): FindOptions<T> {
	const newState = { ...currentState }

	const condition = new Condition()

	switch(constraints.filter.criteria) {
		case "incomplete":
			condition.or(
				(new Condition()).is("emailVerifiedAt", null),
				(new Condition()).is("signature", null)
			)
			break
		case "unverified":
			condition.is("emailVerifiedAt", null)
			break
		case "verified":
			condition.not("emailVerifiedAt", null)
			condition.not("signature", null)
			break
		case "*":
		default:
			break
	}

	if (newState.where === undefined) {
		newState.where = {}
	}

	newState.where = {
		...newState.where,
		...condition.build()
	}

	Log.trace("pipeline", "sift by criteria")

	return newState
}
