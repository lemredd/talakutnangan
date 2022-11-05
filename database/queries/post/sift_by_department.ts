import type { NullableDepartmentFilter } from "$/types/query"
import type { FindOptions } from "%/types/dependent"

import Log from "$!/singletons/log"

import Condition from "%/helpers/condition"
import isUndefined from "$/type_guards/is_undefined"

/**
 * Sift post models which ar associated to a certain department.
 */
export default function<T>(
	currentState: FindOptions<T>,
	constraints: NullableDepartmentFilter<number>
): FindOptions<T> {
	const newState = { ...currentState }

	const condition = new Condition()
	if (constraints.filter.departmentID === null) {
		condition.is("departmentID", constraints.filter.departmentID)
	} else {
		condition.equal("departmentID", constraints.filter.departmentID)
	}

	if (isUndefined(newState.where)) {
		newState.where = {}
	}

	newState.where = new Condition().and(
		new Condition(newState.where),
		condition
	).build()

	Log.trace("pipeline", "sift by department")

	return newState
}
