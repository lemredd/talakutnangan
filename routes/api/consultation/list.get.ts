import type { FieldRules } from "!/types/validation"
import type { Request } from "!/types/dependent"
import type { ConsultationQueryParameters } from "$/types/query"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import Manager from "%/managers/consultation"
import ListResponse from "!/response_infos/list"
import QueryController from "!/controllers/query"

import { READ } from "$/permissions/department_combinations"
import { department as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/policies/permission-based"

import makeListRules from "!/rule_sets/make_list"
import makeIDBasedFilterRules from "!/rule_sets/make_id-based_filter"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ
		])
	}

	makeQueryRuleGenerator(): FieldRules {
		return makeListRules(
			Manager,
			makeIDBasedFilterRules("user", UserManager, true)
		)
	}

	async handle(request: Request): Promise<ListResponse> {
		const constraints = { ...request.query } as ConsultationQueryParameters<number>

		const manager = new Manager(request)
		const consultations = await manager.list(constraints)

		return new ListResponse(consultations)
	}
}
