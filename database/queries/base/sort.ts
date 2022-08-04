import type { Sort } from "$/types/query"
import type { FindOptions, Model } from "%/types/dependent"

import Log from "$!/singletons/log"

/**
 * Selects if the models to retrieve should all, present or archived.
 */
export default function<T extends Model>(
	currentState: FindOptions<T>,
	constraints: Sort
): FindOptions<T> {
	const newState = { ...currentState }

	const rawSortInfo = constraints.sort.map(column => {
		if (column.startsWith("-")) {
			return [ column.slice(1), "DESC" ]
		} else {
			return [ column, "ASC" ]
		}
	})

	if (rawSortInfo.length > 0) {
		if (newState.order === undefined) {
			newState.order = []
		}

		(newState.order as any[]).push(...rawSortInfo)
	}

	Log.trace("pipeline", "sort")

	return newState
}
