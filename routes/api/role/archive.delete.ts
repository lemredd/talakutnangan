import { FieldRules } from "!/types/validation"
import { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import RoleManager from "%/managers/role"
import NoContentResponseInfo from "!/response_infos/no_content"
import JSONController from "!/controllers/json_controller"

import { ARCHIVE_AND_RESTORE } from "$/permissions/role_combinations"
import { role as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/policies/permission-based"

import exists from "!/validators/manager/exists"
import makeResourceIdentifierListDocumentRules
	from "!/rule_sets/make_resource_identifier_list_document"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			ARCHIVE_AND_RESTORE
		])
	}

	makeBodyRuleGenerator(unusedRequest: Request): FieldRules {
		return makeResourceIdentifierListDocumentRules("role", exists, RoleManager)
	}

	async handle(request: Request, unusedResponse: Response): Promise<NoContentResponseInfo> {
		const manager = new RoleManager(request.transaction, request.cache)

		const IDs = request.body.data.map((identifier: { id: number }) => identifier.id)
		await manager.archiveBatch(IDs)

		return new NoContentResponseInfo()
	}
}
