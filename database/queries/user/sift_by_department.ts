import type { FindOptions } from "%/types/dependent"
import type { DepartmentFilter } from "$/types/query"

import Log from "$!/singletons/log"

import Department from "%/models/department"
import Condition from "%/helpers/condition"

/**
 * Sift user model which belong to a certain department.
 */
export default function<T>(
	currentState: FindOptions<T>,
	constraints: DepartmentFilter<number>
): FindOptions<T> {
	const newState = { ...currentState }

	switch (constraints.filter.department) {
		case "*":
			// Do nothing
			break
		default: {
			const condition = new Condition()
			condition.equal("id", constraints.filter.department)

			if (!newState.include) {
				newState.include = []
			}

			(newState.include as any[])!.push({
				"model": Department,
				"required": true,
				"where": condition.build()
			})
			break
		}
	}

	Log.trace("pipeline", "sift by department")

	return newState
}
