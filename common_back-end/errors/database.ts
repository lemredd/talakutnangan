import BaseError from "$!/errors/base"
import RequestEnvironment from "$/singletons/request_environment"

/**
 * Used when there is a general problem in database.
 */
export default class DatabaseError extends BaseError {
	static CODE = "4"
	static STATUS: number = RequestEnvironment.status.INTERNAL_SERVER_ERROR

	constructor(
		message = "There is a database problem. It may be down or operation failed."
	) {
		super(
			DatabaseError.CODE,
			DatabaseError.STATUS,
			"Database Error",
			message
		)
	}
}
