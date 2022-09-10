import BaseError from "$!/errors/base"
import RequestEnvironment from "$/singletons/request_environment"

/**
 * Used when there is a problem on parsing the data.
 */
export default class ParserError extends BaseError {
	static CODE = "5"
	static STATUS: number = RequestEnvironment.status.BAD_REQUEST

	constructor(message = "Data could not be parsed properly") {
		super(
			ParserError.CODE,
			ParserError.STATUS,
			"Parser Error",
			message)
	}
}
