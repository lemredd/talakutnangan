import type { DepartmentFilter } from "$/types/database"
import type { FindOptions } from "%/types/dependent"

import Log from "$!/singletons/log"

import Department from "%/models/department"
import Condition from "%/managers/helpers/condition"

/**
 * Sift user model which belong to a certain department.
 */
export default function<T>(
	currentState: FindOptions<T>,
	constraints: Partial<DepartmentFilter>
): FindOptions<T> {
	const newState = { ...currentState }

	if (constraints.department !== undefined) {
		switch(constraints.department) {
			case "*":
				// do nothing
				break
			default:
				const condition = new Condition()
				condition.equal("fullName", constraints.department)

				if (newState.include === undefined) {
					newState.include = []
				}

				(newState.include as any[])!.push({
					model: Department,
					required: true,
					where: condition.build()
				})
				break
		}

		Log.trace("pipeline", "sift by department")
	}

	return newState
}
