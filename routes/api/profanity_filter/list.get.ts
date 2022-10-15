import type { FieldRules } from "!/types/validation"
import type { RoleQueryParameters } from "$/types/query"
import type { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import Manager from "%/managers/profanity_filter"
import ListResponse from "!/response_infos/list"
import QueryController from "!/controllers/query"

import { READ } from "$/permissions/profanity_combinations"
import PermissionBasedPolicy from "!/policies/permission-based"
import { profanity as permissionGroup } from "$/permissions/permission_list"

import makeListRules from "!/rule_sets/make_list"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ
		])
	}

	makeQueryRuleGenerator(unusedRequest: Request): FieldRules {
		return makeListRules(Manager, {})
	}

	async handle(request: Request, unusedResponse: Response): Promise<ListResponse> {
		const constraints = { ...request.query } as RoleQueryParameters<number>

		const manager = new Manager(request)
		const profanityFilter = await manager.list(constraints)

		return new ListResponse(profanityFilter)
	}
}
