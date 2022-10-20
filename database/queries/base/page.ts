import type { Page } from "$/types/query"
import type { FindOptions, Model } from "%/types/dependent"

import Log from "$!/singletons/log"

/**
 * Limits and paginates the number of possible users to select.
 */
export default function<T extends Model>(
	currentState: FindOptions<T>,
	constraints: Page
): FindOptions<T> {
	const newState = { ...currentState }

	const { offset } = constraints.page
	const rawLimit = constraints.page.limit
	const highestPossibleLimit = Number(process.env.DATABASE_MAX_SELECT ?? "10")
	const limit = Math.min(rawLimit, highestPossibleLimit)

	newState.offset = offset
	newState.limit = limit

	Log.trace("pipeline", "page")

	return newState
}
