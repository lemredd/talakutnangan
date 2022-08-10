import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { CommonQueryParameters } from "$/types/query"

import Policy from "!/bases/policy"
import ListResponse from "!/response_infos/list"
import ConsultationManager from "%/managers/consultation"
import QueryController from "!/controllers/query_controller"

import { READ } from "$/permissions/department_combinations"
import { department as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/policies/permission-based"

import makeListRules from "!/rule_sets/make_list"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ
		])
	}

	makeQueryRuleGenerator(request: Request): FieldRules {
		return makeListRules(ConsultationManager, {})
	}

	async handle(request: Request, response: Response): Promise<ListResponse> {
		const constraints = { ...request.query }

		const manager = new ConsultationManager(request.transaction, request.cache)
		const consultations = await manager.list(constraints as CommonQueryParameters)

		return new ListResponse(consultations)
	}
}
