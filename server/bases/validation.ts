import type { GeneralObject } from "$/types/general"
import type { FieldRulesMaker } from "!/types/hybrid"
import type { ErrorPointer, SourceType } from "!/types/independent"
import type { SourceParameter, SourcePointer } from "$/types/server"
import type { Request, Response, NextFunction } from "!/types/dependent"


import Log from "$!/singletons/log"
import ErrorBag from "$!/errors/error_bag"
import Middleware from "!/bases/middleware"
import validate from "!/app/validators/validate"
import ValidationError from "$!/errors/validation"
import accessDeepPath from "$!/helpers/access_deep_path"

export default abstract class extends Middleware {
	private validationRules: FieldRulesMaker

	constructor(validationRules: FieldRulesMaker) {
		super()
		this.validationRules = validationRules
	}

	abstract getSubject(request: Request): object

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		try {
			await this.validate(this.getSubject(request), request)
			next()
		} catch(error) {
			next(error)
		}
	}

	async validate(body: GeneralObject, request: Request): Promise<void> {
		let errorInfos: any = null

		Log.success("migration", "Validating using new method in "+request.url)
		try {
			const validationRules = this.validationRules(request)
			const sanitizedInputs = await validate(validationRules, request, body)

			// Clear the body
			for (const field in body) {
				if (Object.prototype.hasOwnProperty.call(body, field)) {
					delete body[field]
				}
			}

			// Inject the body with sanitized inputs
			for (const field in sanitizedInputs) {
				if (Object.prototype.hasOwnProperty.call(sanitizedInputs, field)) {
					body[field] = sanitizedInputs[field]
				}
			}
		} catch(error) {
			errorInfos = (error as ErrorPointer[]).map(error => ({
				field: error.field,
				message: error.messageMaker(error.field, accessDeepPath(body, error.field))
			}))
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
