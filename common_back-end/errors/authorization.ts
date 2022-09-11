import BaseError from "$!/errors/base"
import RequestEnvironment from "$/singletons/request_environment"

/**
 * Used when there is a problem on authorizing the client.
 */
export default class AuthorizationError extends BaseError {
	static CODE = "1"
	static STATUS: number = RequestEnvironment.status.UNAUTHORIZED

	constructor(
		message = "User is not allowed to invoke the action.",
		redirectLink: string|null = null
	) {
		super(
			AuthorizationError.CODE,
			AuthorizationError.STATUS,
			"Authorization Error",
			message,
			redirectLink
		)
	}
}
