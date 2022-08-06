import BaseError from "$!/errors/base"
import RequestEnvironment from "$/helpers/request_environment"

/**
 * Used when there is a problem on parsing the data.
 */
export default class ParserError extends BaseError {
	static CODE: string = "5"
	static STATUS: number = RequestEnvironment.status.BAD_REQUEST

	constructor(message: string = "Data could not be parsed properly") {
		super(
			ParserError.CODE,
			ParserError.STATUS,
			"Parser Error",
			message)
	}
}
