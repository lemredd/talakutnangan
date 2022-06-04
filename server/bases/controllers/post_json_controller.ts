import { Request, Response, NextFunction } from "express"
import { Validator } from "node-input-validator"
import { ValidationError } from "!/types"
import Middleware from "!/bases/middleware"
import PostController from "!/bases/controllers/post_controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default abstract class extends PostController {
	getPremiddlewares(): Middleware[] {
		return [
			...super.getPremiddlewares(),
			CommonMiddlewareList.JSONBody,
			this.createValidationMiddleware()
		]
	}

	abstract get validationRules(): object;

	createValidationMiddleware(): Middleware {
		const validateFromParent = this.validate.bind(this)
		return new class extends Middleware {
			async intermediate(request: Request, response: Response, next: NextFunction)
				: Promise<void> {
				const errors = await validateFromParent(request.body)
				if (errors.length > 0) {
					response.status(this.status.BAD_REQUEST).json(errors)
				} else {
					next()
				}
			}
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
