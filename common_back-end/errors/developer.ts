import BaseError from "$!/errors/base"
import RequestEnvironment from "$/singletons/request_environment"

/**
 * Used when there is a general problem in database.
 */
export default class DeveloperError extends BaseError {
	static CODE = "6"
	static STATUS: number = RequestEnvironment.status.INTERNAL_SERVER_ERROR

	constructor(
		developmentMessage = "There is a logical error commited by a developer on the server.",
		productionMessage = "There is a logical error on the server."
	) {
		super(
			DeveloperError.CODE,
			DeveloperError.STATUS,
			RequestEnvironment.isNotOnProduction ? "Developer Error" : "Server error",
			RequestEnvironment.isNotOnProduction ? developmentMessage : productionMessage
		)
	}
}
