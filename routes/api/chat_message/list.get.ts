import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { ChatMessageQueryParameters } from "$/types/query"

import Policy from "!/bases/policy"
import Manager from "%/managers/chat_message"
import ListResponse from "!/response_infos/list"
import QueryController from "!/controllers/query"

import { READ } from "$/permissions/audit_trail_combinations"
import PermissionBasedPolicy from "!/policies/permission-based"
import { auditTrail as permissionGroup } from "$/permissions/permission_list"

import required from "!/validators/base/required"
import makeListRules from "!/rule_sets/make_list"
import makeMultiIDBasedFilterRules from "!/rule_sets/make_multi-id-based_filter"
import doesBelongToCurrentUser from "!/validators/manager/does_belong_to_user"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ
		])
	}

	makeQueryRuleGenerator(unusedRequest: Request): FieldRules {
		return makeListRules(Manager, {
			...makeMultiIDBasedFilterRules(Manager, {
				"initialPipes": [ required ],
				"multipleIDKey": "consultationIDs",
				"mustCast": true,
				"postIDRules": {
					"pipes": [ doesBelongToCurrentUser ]
				}
			})
		}, {
			"defaultSortColumn": "-createdAt"
		})
	}

	async handle(request: Request, unusedResponse: Response): Promise<ListResponse> {
		const constraints = { ...request.query }

		const manager = new Manager(request)
		const auditTrails = await manager.list(constraints as ChatMessageQueryParameters<number>)

		return new ListResponse(auditTrails)
	}
}
