import BaseError from "$!/errors/base"
import RequestEnvironment from "$/singletons/request_environment"

/**
 * Used when there is a request that is still being handled and not yet finished.
 */
export default class StillProcessingError extends BaseError {
	static CODE = "7"
	static STATUS: number = RequestEnvironment.status.CONFLICT

	constructor(
		message = "Your request is being processed."
	) {
		super(
			StillProcessingError.CODE,
			StillProcessingError.STATUS,
			"Still Processing Error",
			message
		)
	}
}
