import { UserKindValues } from "$/types/database"
import type { FieldRules } from "!/types/validation"
import type { UserQueryParameters } from "$/types/query"
import type { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import RoleManager from "%/managers/role"
import ListResponse from "!/response_infos/list"
import DepartmentManager from "%/managers/department"
import QueryController from "!/controllers/query_controller"

import { user as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/policies/permission-based"
import {
	READ_ANYONE_ON_OWN_DEPARTMENT,
	READ_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import exists from "!/validators/manager/exists"
import nullable from "!/validators/base/nullable"
import oneOf from "!/validators/comparison/one-of"
import skipAsterisk from "!/validators/comparison/skip_asterisk"

import makeListRules from "!/rule_sets/make_list"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ_ANYONE_ON_OWN_DEPARTMENT,
			READ_ANYONE_ON_ALL_DEPARTMENTS
		])
	}

	makeQueryRuleGenerator(unusedRequest: Request): FieldRules {
		return makeListRules(UserManager, {
			slug: {
				pipes: [ nullable, string ],
				constraints: {
					nullable: { defaultValue: "" }
				}
			},
			department: {
				pipes: [ nullable, skipAsterisk, integer, exists ],
				constraints: {
					nullable: { defaultValue: "*" },
					manager: {
						className: DepartmentManager,
						columnName: "id"
					}
				}
			},
			role: {
				pipes: [ nullable, skipAsterisk, integer, exists ],
				constraints: {
					nullable: { defaultValue: "*" },
					manager: {
						className: RoleManager,
						columnName: "id"
					}
				}
			},
			kind: {
				pipes: [ nullable, string, skipAsterisk, oneOf ],
				constraints: {
					nullable: { defaultValue: "*" },
					oneOf: { values: [ ...UserKindValues ] }
				}
			}
		})
	}

	async handle(request: Request, unusedResponse: Response): Promise<ListResponse> {
		const manager = new UserManager(request.transaction, request.cache)
		const users = await manager.list(request.query as UserQueryParameters)

		return new ListResponse(users)
	}
}
