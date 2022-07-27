import { Validator } from "node-input-validator"

import type { FieldRulesMaker } from "!/types/hybrid"
import type { ValidationRules, ErrorPointer } from "!/types/independent"
import type { Request, Response, NextFunction } from "!/types/dependent"
import type { GeneralObject, SourceParameter, SourcePointer } from "$/types/server"
import accessDeepPath from "!/helpers/access_deep_path"

import Log from "$!/singletons/log"
import ErrorBag from "$!/errors/error_bag"
import Middleware from "!/bases/middleware"
import validate from "!/app/validators/validate"
import ValidationError from "$!/errors/validation"
import generateProperRules from "!/helpers/generate_proper_rules"

export default abstract class extends Middleware {
	private validationRules: object|FieldRulesMaker

	constructor(validationRules: object|FieldRulesMaker) {
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
		if (this.validationRules instanceof Function) {
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
		} else {
			Log.warn("migration", "Validating using old method in "+request.url)
			const validator = new Validator(
				body,
				generateProperRules(body, this.validationRules as ValidationRules)
			)

			if (await validator.fails()) {
				errorInfos = Object.keys(validator.errors).sort().map(field => ({
					field,
					message: validator.errors[field].message
				}))
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
	get sourceType(): "pointer"|"parameter"|null { return "pointer" }
}
