import type { FieldRules } from "!/types/validation"
import type { RoleQueryParameters } from "$/types/query"
import type { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import Manager from "%/managers/role"
import ListResponse from "!/response_infos/list"
import DepartmentManager from "%/managers/department"
import QueryController from "!/controllers/query"

import { READ } from "$/permissions/role_combinations"
import PermissionBasedPolicy from "!/policies/permission-based"
import { role as permissionGroup } from "$/permissions/permission_list"

import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import exists from "!/validators/manager/exists"
import nullable from "!/validators/base/nullable"
import makeListRules from "!/rule_sets/make_list"
import length from "!/validators/comparison/length"
import stringArray from "!/validators/hybrid/string_array"
import makeIDBasedFilterRules from "!/rule_sets/make_id-based_filter"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ
		])
	}

	makeQueryRuleGenerator(unusedRequest: Request): FieldRules {
		return makeListRules(
			Manager,
			{
				...makeIDBasedFilterRules("department", DepartmentManager, true),
				"IDs": {
					"constraints": {
						"array": {
							"constraints": {
								"integer": { "mustCast": true },
								"manager": {
									"className": Manager,
									"columnName": "id"
								}
							},
							"pipes": [ string, integer, exists ]
						},
						"length": {
							// TODO: Find the best length
							"maximum": 24,
							"minimum": 1
						}
					},
					"pipes": [ nullable, stringArray, length ]
				}
			}
		)
	}

	async handle(request: Request, unusedResponse: Response): Promise<ListResponse> {
		const constraints = { ...request.query } as RoleQueryParameters<number>

		const manager = new Manager(request.transaction, request.cache)
		const roles = await manager.list(constraints)

		return new ListResponse(roles)
	}
}
