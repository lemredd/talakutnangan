import type { FieldRules } from "!/types/validation"
import type { RoleQueryParameters } from "$/types/query"
import type { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import RoleManager from "%/managers/role"
import ListResponse from "!/response_infos/list"
import DepartmentManager from "%/managers/department"
import QueryController from "!/common_controllers/query_controller"

import { READ } from "$/permissions/role_combinations"
import { role as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"

import integer from "!/validators/base/integer"
import exists from "!/validators/manager/exists"
import nullable from "!/validators/base/nullable"
import makeListRules from "!/rule_sets/make_list"
import skipAsterisk from "!/validators/comparison/skip_asterisk"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ
		])
	}

	makeQueryRuleGenerator(request: Request): FieldRules {
		return makeListRules(RoleManager, {
			department: {
				pipes: [ nullable, skipAsterisk, integer, exists ],
				constraints: {
					nullable: { defaultValue: "*" },
					manager: {
						className: DepartmentManager,
						columnName: "id"
					}
				}
			}
		})
	}

	async handle(request: Request, response: Response): Promise<ListResponse> {
		const constraints = { ...request.query } as RoleQueryParameters

		const manager = new RoleManager(request.transaction, request.cache)
		const roles = await manager.list(constraints)

		return new ListResponse(roles)
	}
}
