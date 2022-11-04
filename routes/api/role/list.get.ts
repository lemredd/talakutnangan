import type { FieldRules } from "!/types/validation"
import type { RoleQueryParameters } from "$/types/query"
import type { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import Manager from "%/managers/role"
import ListResponse from "!/response_infos/list"
import QueryController from "!/controllers/query"
import DepartmentManager from "%/managers/department"

import { READ } from "$/permissions/role_combinations"
import PermissionBasedPolicy from "!/policies/permission-based"
import { role as permissionGroup } from "$/permissions/permission_list"

import string from "!/validators/base/string"
import nullable from "!/validators/base/nullable"
import makeListRules from "!/rule_sets/make_list"
import makeIDBasedFilterRules from "!/rule_sets/make_id-based_filter"
import makeMultiIDBasedFilterRules from "!/rule_sets/make_multi-id-based_filter"

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
				"slug": {
					"constraints": {
						"nullable": { "defaultValue": "" }
					},
					"pipes": [ nullable, string ]
				},
				...makeIDBasedFilterRules("department", DepartmentManager, { "mustCast": true }),
				...makeMultiIDBasedFilterRules(Manager, { "mustCast": true })
			}
		)
	}

	async handle(request: Request, unusedResponse: Response): Promise<ListResponse> {
		const constraints = { ...request.query } as RoleQueryParameters<number>

		const manager = new Manager(request)
		const roles = await manager.list(constraints)

		return new ListResponse(roles)
	}
}
