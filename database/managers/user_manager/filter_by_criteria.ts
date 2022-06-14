import type { Criteria } from "%/types/independent"

import Log from "!/helpers/log"
import Condition from "%/managers/helpers/condition"

export default function<T extends { where: object, [key: string]: any }>(
	currentState: T,
	constraints: { criteria?: Criteria | undefined, [key: string]: any }
): T {
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
