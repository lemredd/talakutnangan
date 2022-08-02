import { UserKindValues } from "$/types/database"
import type { UserQueryFilter } from "$/types/query"
import type { FieldRules } from "!/types/validation"
import type { FieldRulesMaker } from "!/types/hybrid"
import type { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import ListResponse from "!/response_infos/list"
import QueryController from "!/common_controllers/query_controller"

import { user as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"
import {
	READ_ANYONE_ON_OWN_DEPARTMENT,
	READ_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

import string from "!/app/validators/base/string"
import nullable from "!/app/validators/base/nullable"
import oneOf from "!/app/validators/comparison/one-of"

import makeListRules from "!/app/rule_sets/make_list"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ_ANYONE_ON_OWN_DEPARTMENT,
			READ_ANYONE_ON_ALL_DEPARTMENTS
		])
	}

	get queryValidationRules(): object {
		return {}
	}

	makeQueryRuleGenerator(): FieldRulesMaker {
		// TODO: make a validator to skip "*" character
		return (request: Request): FieldRules => makeListRules(UserManager, {
			slug: {
				pipes: [ nullable, string ],
				constraints: {
					nullable: { defaultValue: "" }
				}
			},
			department: {
				pipes: [ nullable, string ],
				constraints: {
					nullable: { defaultValue: "*" }
				}
			},
			role: {
				pipes: [ nullable, string ],
				constraints: {
					nullable: { defaultValue: "*" }
				}
			},
			kind: {
				pipes: [ nullable, string, oneOf ],
				constraints: {
					nullable: { defaultValue: "*" },
					oneOf: { values: [ "*", ...UserKindValues ] }
				}
			}
		})
	}
	async handle(request: Request, response: Response): Promise<ListResponse> {
		const manager = new UserManager(request.transaction, request.cache)
		const users = await manager.list(request.query as UserQueryFilter)

		return new ListResponse(users)
	}
}
