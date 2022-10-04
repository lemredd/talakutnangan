import { UserKindValues } from "$/types/database"
import type { FieldRules } from "!/types/validation"
import type { UserQueryParameters } from "$/types/query"
import type { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import RoleManager from "%/managers/role"
import ListResponse from "!/response_infos/list"
import DepartmentManager from "%/managers/department"
import QueryController from "!/controllers/query"

import CommonMiddlewareList from "!/middlewares/common_middleware_list"

import string from "!/validators/base/string"
import nullable from "!/validators/base/nullable"
import oneOf from "!/validators/comparison/one-of"
import skipAsterisk from "!/validators/comparison/skip_asterisk"
import makeIDBasedFilterRules from "!/rule_sets/make_id-based_filter"

import makeListRules from "!/rule_sets/make_list"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return CommonMiddlewareList.knownOnlyPolicy
	}

	makeQueryRuleGenerator(unusedRequest: Request): FieldRules {
		return makeListRules(UserManager, {
			"slug": {
				"constraints": {
					"nullable": { "defaultValue": "" }
				},
				"pipes": [ nullable, string ]
			},
			...makeIDBasedFilterRules("department", DepartmentManager, { "mustCast": true }),
			...makeIDBasedFilterRules("role", RoleManager, { "mustCast": true }),
			"kind": {
				"constraints": {
					"nullable": { "defaultValue": "*" },
					"oneOf": { "values": [ ...UserKindValues ] }
				},
				"pipes": [ nullable, string, skipAsterisk, oneOf ]
			}
		})
	}

	async handle(request: Request, unusedResponse: Response): Promise<ListResponse> {
		const manager = new UserManager(request)
		const users = await manager.list(request.query as UserQueryParameters<number>)

		return new ListResponse(users)
	}
}
