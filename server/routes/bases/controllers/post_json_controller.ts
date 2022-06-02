import { Request, Response, NextFunction } from "express"
import { Validator } from "node-input-validator"
import { ValidationError } from "!/types"
import Middleware from "!/routes/bases/middleware"
import PostController from "!/routes/bases/controllers/post_controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default abstract class extends PostController {
	getPremiddlewares(): Middleware[] {
		return [
			...super.getPremiddlewares(),
			CommonMiddlewareList.JSONBody
		]
	}

	abstract get validationRules(): object;

	abstract handleValidatedBody(request: Request, response: Response): Promise<void>;

	async handle(request: Request, response: Response): Promise<void> {
		const errors = await this.validate(request.body)
		if (errors.length > 0) {
			response.status(this.status.BAD_REQUEST).json(errors)
		} else {
			await this.handleValidatedBody(request, response)
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
