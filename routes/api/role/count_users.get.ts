import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { RoleResourceIdentifier } from "$/types/documents/role"

import Policy from "!/bases/policy"
import RoleManager from "%/managers/role"
import ListResponse from "!/response_infos/list"
import JSONController from "!/controllers/json_controller"

import { READ } from "$/permissions/role_combinations"
import PermissionBasedPolicy from "!/policies/permission-based"
import { role as permissionGroup } from "$/permissions/permission_list"

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
		return makeResourceIdentifierListDocumentRules("role", present, RoleManager)
	}

	async handle(request: Request, response: Response): Promise<ListResponse> {
		const IDs = (request.body.data as RoleResourceIdentifier<number>[]).map(object => {
			return object.id
		})

		const manager = new RoleManager(request.transaction, request.cache)
		const rolesWithUserCount = await manager.countUsers(IDs)

		return new ListResponse(rolesWithUserCount)
	}
}
