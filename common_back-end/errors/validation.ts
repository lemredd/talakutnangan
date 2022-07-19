import BaseError from "$!/errors/base"
import RequestEnvironment from "$/helpers/request_environment"

/**
 * Used when there is a invalid field.
 */
export default class ValidationError extends BaseError {
	static CODE: string = "3"
	static STATUS: number = RequestEnvironment.status.BAD_REQUEST

	constructor(source: string, message: string = "Input should be valid") {
		super(
			ValidationError.CODE,
			ValidationError.STATUS,
			"Validation Error",
			message)
	}
}
