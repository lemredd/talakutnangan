import type { UnitError, SourcePointer, SourceParameter } from "$/types/server"
import BaseError from "$!/errors/base"
import RequestEnvironment from "$/singletons/request_environment"

/**
 * Used when there is a invalid field.
 */
export default class ValidationError extends BaseError {
	static CODE = "3"
	static STATUS: number = RequestEnvironment.status.BAD_REQUEST

	private source: SourcePointer|SourceParameter|null

	constructor(
		source: SourcePointer|SourceParameter|null,
		message = "Input should be valid"
	) {
		super(
			ValidationError.CODE,
			ValidationError.STATUS,
			"Validation Error",
			message
		)
		this.source = source
	}

	toJSON(): UnitError {
		const unitError = super.toJSON()

		if (this.source) {
			unitError.source = this.source
		}

		return unitError
	}
}
