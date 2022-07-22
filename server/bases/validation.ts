import { Validator } from "node-input-validator"

import type { ValidationRules } from "!/types/independent"
import { SourceParameter, SourcePointer } from "$/types/server"
import { Request, Response, NextFunction } from "!/types/dependent"

import ErrorBag from "$!/errors/error_bag"
import Middleware from "!/bases/middleware"
import ValidationError from "$!/errors/validation"
import generateProperRules from "!/helpers/generate_proper_rules"

export default abstract class extends Middleware {
	private validationRules: object

	constructor(validationRules: object) {
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
		const validator = new Validator(
			body,
			generateProperRules(body, this.validationRules as ValidationRules)
		)

		if (await validator.fails()) {
			const errorInfos = Object.keys(validator.errors).sort().map(field => ({
				field,
				message: validator.errors[field].message
			}))

			throw new ErrorBag(
				errorInfos.map((info: any) => new ValidationError(
					{
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
	get sourceType(): "pointer"|"parameter" { return "pointer" }
}
