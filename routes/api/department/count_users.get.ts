import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { DepartmentResourceIdentifier } from "$/types/documents/department"

import Policy from "!/bases/policy"
import DepartmentManager from "%/managers/department"
import ListResponse from "!/response_infos/list"
import JSONController from "!/controllers/json_controller"

import { READ } from "$/permissions/department_combinations"
import { department as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/policies/permission-based"

import present from "!/validators/manager/present"
import makeResourceIdentifierListDocumentRules
	from "!/rule_sets/make_resource_identifier_list_document"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ
		])
	}

	makeBodyRuleGenerator(request: Request): FieldRules {
		return makeResourceIdentifierListDocumentRules("department", present, DepartmentManager)
	}

	async handle(request: Request, response: Response): Promise<ListResponse> {
		const IDs = (request.body.data as DepartmentResourceIdentifier<number>[]).map(object => {
			return object.id
		})

		const manager = new DepartmentManager(request.transaction, request.cache)
		const departmentWithUserCount = await manager.countUsers(IDs)

		return new ListResponse(departmentWithUserCount)
	}
}
