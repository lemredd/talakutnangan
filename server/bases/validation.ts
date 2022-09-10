import type { Request } from "!/types/dependent"
import type { GeneralObject } from "$/types/general"
import type { FieldRulesMaker } from "!/types/hybrid"
import type { ErrorPointer, SourceType } from "!/types/independent"
import type { SourceParameter, SourcePointer } from "$/types/server"

import Log from "$!/singletons/log"
import ErrorBag from "$!/errors/error_bag"
import validate from "!/validators/validate"
import ValidationError from "$!/errors/validation"
import RequestFilter from "!/bases/request_filter"
import accessDeepPath from "$!/helpers/access_deep_path"

export default abstract class extends RequestFilter {
	private validationRules: FieldRulesMaker

	constructor(validationRules: FieldRulesMaker) {
		super()
		this.validationRules = validationRules
	}

	abstract getSubject(request: Request): object

	async filterRequest(request: Request): Promise<void> {
		await this.validate(this.getSubject(request), request)
	}

	async validate(body: GeneralObject, request: Request): Promise<void> {
		let errorInfos: any = null

		Log.success("middleware", `Validating in ${request.url}`)
		try {
			const validationRules = this.validationRules(request)
			const sanitizedInputs = await validate(validationRules, request, body)

			// Clear the body
			for (const field in body) {
				if (Object.hasOwn(body, field)) {
					delete body[field]
				}
			}

			// Inject the body with sanitized inputs
			for (const field in sanitizedInputs) {
				if (Object.hasOwn(sanitizedInputs, field)) {
					body[field] = sanitizedInputs[field]
				}
			}
		} catch (rawError) {
			if (Array.isArray(rawError)) {
				const castErrors = rawError as ErrorPointer[]
				errorInfos = castErrors.map(error => ({
					"field": error.field,
					"message": error.messageMaker(
						error.friendlyName || error.field,
						accessDeepPath(body, error.field)
					)
				}))
			} else {
				const castError = rawError as ErrorPointer
				errorInfos = [
					{
						"field": castError.field,
						"message": castError.messageMaker(
							castError.friendlyName || castError.field,
							accessDeepPath(body, castError.field)
						)
					}
				]
			}
		}

		if (errorInfos !== null) {
			throw new ErrorBag(
				errorInfos.map((info: any) => new ValidationError(
					this.sourceType === null
						? null
						: {
							[this.sourceType]: info.field
						} as SourceParameter|SourcePointer,
					info.message
				))
			)
		}
	}

	/**
	 * Type of source where the validation error comes from.
	 */
	get sourceType(): SourceType { return "pointer" }
}
