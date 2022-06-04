import { Validator } from "node-input-validator"
import { Request, Response, NextFunction } from "express"

import { ValidationError } from "!/types"
import Middleware from "!/bases/middleware"

export default abstract class extends Middleware {
	private validationRules: object

	constructor(validationRules: object) {
		super()
		this.validationRules = validationRules
	}

	abstract getSubject(request: Request): object

	intermediate(request: Request, response: Response, next: NextFunction): void {
		this.validate(this.getSubject).then(errors => {
			if (errors.length > 0) {
				response.status(this.status.BAD_REQUEST).json(errors)
			} else {
				next()
			}
		})
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
