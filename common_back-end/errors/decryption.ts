import BaseError from "$!/errors/base"
import RequestEnvironment from "$/helpers/request_environment"

/**
 * Used when there is a problem on decrypting data.
 */
export default class DecryptionError extends BaseError {
	static CODE: string = "2"
	static STATUS: number = RequestEnvironment.status.BAD_REQUEST

	constructor(message: string = "Data could not be decrypted properly") {
		super(
			DecryptionError.CODE,
			DecryptionError.STATUS,
			"Decryption Error",
			message)
	}
}
