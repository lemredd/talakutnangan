import { Validator } from "node-input-validator"

import type { ValidationRules } from "!/types/independent"
import { SourceParameter, SourcePointer } from "$/types/server"
import { Request, Response, NextFunction } from "!/types/dependent"

import Log from "$!/singletons/log"
import ErrorBag from "$!/errors/error_bag"
import Middleware from "!/bases/middleware"
import validate from "!/app/validators/validate"
import ValidationError from "$!/errors/validation"
import BaseValidator from "!/app/validators/base/base"
import generateProperRules from "!/helpers/generate_proper_rules"

export default abstract class extends Middleware {
	private validationRules: object|{ [key:string]: BaseValidator }

	constructor(validationRules: object|{ [key:string]: BaseValidator }) {
		super()
		this.validationRules = validationRules
	}

	abstract getSubject(request: Request): object

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		try {
			await this.validate(this.getSubject(request))
			next()
		} catch(error) {
			next(error)
		}
	}

	async validate(body: object): Promise<void> {
		let errorInfos: any = null
		if (Object.values(this.validationRules)[0] instanceof BaseValidator) {
			try {
				await validate(this.validationRules as { [key:string]: BaseValidator }, body)
			} catch(error) {
				errorInfos = error
			}
		} else {
			Log.warn(
				"migration",
				"Validating using old method with "+JSON.stringify(this.validationRules)
			)
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
