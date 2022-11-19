import type { FieldRules } from "!/types/validation"
import type { AuthenticatedRequest, Response } from "!/types/dependent"
import type { OptionalMiddleware } from "!/types/independent"

import { v4 } from "uuid"

import Policy from "!/bases/policy"
import OkResponseInfo from "!/response_infos/ok"
import UserManager from "%/managers/user"
import JSONController from "!/controllers/json"
import ActionAuditor from "!/middlewares/miscellaneous/action_auditor"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import LocalLogInMiddleware from "!/middlewares/authentication/local_log_in"

import string from "!/validators/base/string"
import exists from "!/validators/manager/exists"
import required from "!/validators/base/required"
import length from "!/validators/comparison/length"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy { return CommonMiddlewareList.guestOnlyPolicy }

	makeBodyRuleGenerator(unusedRequest: AuthenticatedRequest): FieldRules {
		return {
			"email": {
				"constraints": {
					"length": {
						"maximum": 255,
						"minimum": 3
					},
					"manager": {
						"className": UserManager,
						"columnName": "email"
					}
				},
				"pipes": [ required, string, length, exists ]
			},
			"password": {
				"constraints": {
					"length": {
						"maximum": 255,
						"minimum": 8
					}
				},
				"pipes": [ required, string, length ]
			}
		}
	}

	get middlewares(): OptionalMiddleware[] {
		return [
			...super.middlewares,
			new LocalLogInMiddleware()
		]
	}

	handle(request: AuthenticatedRequest, unusedResponse: Response): Promise<OkResponseInfo> {
		const { user } = request
		const token = v4()
		request.session.token = token

		return Promise.resolve(new OkResponseInfo({
			"email": user.email,
			token
		}))
	}

	get postJobs(): ActionAuditor[] {
		return [
			new ActionAuditor("user.log_in", () => ({ "isSensitive": true }))
		]
	}
}
