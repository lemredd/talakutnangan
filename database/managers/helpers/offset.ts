import Log from "!/helpers/log"

/**
 * Skips any number of model to retrieve from database.
 */
export default function<T extends { offset: number }>(
	currentState: T,
	constraints: { page?: number, [key: string]: any }
): T {
	const newState = { ...currentState }

	if (constraints.page !== undefined) {
		newState.offset = constraints.page

		Log.trace("pipeline", "applied offset on query")
	}

	return newState
}
