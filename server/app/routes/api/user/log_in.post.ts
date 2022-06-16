import { v4 } from "uuid"

import { OptionalMiddleware } from "$/types/independent"
import { AuthenticatedRequest, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import JSONController from "!/common_controllers/json_controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import LocalLogInMiddleware from "!/middlewares/authentication/local_log_in"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy { return CommonMiddlewareList.guestOnlyPolicy }

	get bodyValidationRules(): object {
		return {
			email: [ "required", "string", "email", "maxLength:255" ],
			password: [ "required", "string", "minLength:8" ]
		}
	}

	get middlewares(): OptionalMiddleware[] {
		return [
			...super.middlewares,
			new LocalLogInMiddleware()
		]
	}

	async handle(request: AuthenticatedRequest, response: Response): Promise<void> {
		const user = request.user
		const token = v4()
		request.session.token = token
		response.status(this.status.OK).json({
			email: user.email,
			token
		})
	}
}
