import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { CommonQueryParameters } from "$/types/query"

import Policy from "!/bases/policy"
import ListResponse from "!/response_infos/list"
import Manager from "%/managers/comment_vote"
import QueryController from "!/controllers/query"

import {
	READ_ANYONE_ON_OWN_DEPARTMENT,
	READ_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/comment_combinations"
import PermissionBasedPolicy from "!/policies/permission-based"
import { auditTrail as permissionGroup } from "$/permissions/permission_list"

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
		return makeListRules(Manager, {})
	}

	async handle(request: Request, unusedResponse: Response): Promise<ListResponse> {
		const constraints = { ...request.query }

		const manager = new Manager(request)
		const auditTrails = await manager.list(constraints as CommonQueryParameters)

		return new ListResponse(auditTrails)
	}
}
