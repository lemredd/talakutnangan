import type { FieldRules } from "!/types/validation"
import type { AuthenticatedRequest, Response } from "!/types/dependent"
import type { OptionalMiddleware } from "!/types/independent"

import { v4 } from "uuid"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import JSONController from "!/common_controllers/json_controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import LocalLogInMiddleware from "!/middlewares/authentication/local_log_in"

import string from "!/validators/base/string"
import exists from "!/validators/manager/exists"
import required from "!/validators/base/required"
import length from "!/validators/comparison/length"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy { return CommonMiddlewareList.guestOnlyPolicy }

	makeBodyRuleGenerator(request: AuthenticatedRequest): FieldRules {
		return {
			email: {
				pipes: [ required, string, length, exists ],
				constraints: {
					length: { minimum: 3, maximum: 255 },
					manager: {
						className: UserManager,
						columnName: "email"
					}
				}
			},
			password: {
				pipes: [ required, string, length ],
				constraints: {
					length: { minimum: 8, maximum: 255 }
				}
			}
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
