import BaseError from "$!/errors/base"
import RequestEnvironment from "$/helpers/request_environment"

/**
 * Used when there is a problem on authorizing the client.
 */
export default class AuthorizationError extends BaseError {
	static CODE: string = "1"
	static STATUS: number = RequestEnvironment.status.UNAUTHORIZED

	constructor(message: string = "User is not allowed to invoke the action.") {
		super(
			AuthorizationError.CODE,
			AuthorizationError.STATUS,
			"Authorization Error",
			message)
	}
}
