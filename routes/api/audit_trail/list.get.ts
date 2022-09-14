import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { CommonQueryParameters } from "$/types/query"

import Policy from "!/bases/policy"
import ListResponse from "!/response_infos/list"
import AuditTrailManager from "%/managers/audit_trail"
import QueryController from "!/controllers/query"

import { READ } from "$/permissions/audit_trail_combinations"
import PermissionBasedPolicy from "!/policies/permission-based"
import { auditTrail as permissionGroup } from "$/permissions/permission_list"

import makeListRules from "!/rule_sets/make_list"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ
		])
	}

	makeQueryRuleGenerator(unusedRequest: Request): FieldRules {
		return makeListRules(AuditTrailManager, {})
	}

	async handle(request: Request, unusedResponse: Response): Promise<ListResponse> {
		const constraints = { ...request.query }

		const manager = new AuditTrailManager(request)
		const auditTrails = await manager.list(constraints as CommonQueryParameters)

		return new ListResponse(auditTrails)
	}
}
