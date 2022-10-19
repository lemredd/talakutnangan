import type { DepartmentFilter } from "$/types/query"
import type { FindOptions, IncludeOptions } from "%/types/dependent"

import Log from "$!/singletons/log"

import Condition from "%/helpers/condition"
import Department from "%/models/department"
import isUndefined from "$/type_guards/is_undefined"

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

			if (isUndefined(newState.include)) {
				newState.include = []
			}

			const castInclude = newState.include as IncludeOptions[]
			castInclude.push({
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
