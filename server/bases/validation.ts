import { Validator } from "node-input-validator"
import { Request, Response, NextFunction } from "express"

import Middleware from "!/bases/middleware"
import { ValidationError } from "!/types/independent"

export default abstract class extends Middleware {
	private validationRules: object

	constructor(validationRules: object) {
		super()
		this.validationRules = validationRules
	}

	abstract getSubject(request: Request): object

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		const errors = await this.validate(this.getSubject(request))
		if (errors.length > 0) {
			response.status(this.status.BAD_REQUEST).json(errors)
		} else {
			next()
		}
	}

	async validate(body: object): Promise<ValidationError[]> {
		const validator = new Validator(body, this.validationRules)

		await validator.check()

		const rawErrors = validator.getErrors()

		return Object.keys(rawErrors).sort().map(field => ({
			field,
			message: rawErrors[field].message
		}))
	}
}
