import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import Manager from "%/managers/semester"
import JSONController from "!/controllers/json"
import NoContentResponseInfo from "!/response_infos/no_content"

import { ARCHIVE_AND_RESTORE } from "$/permissions/semester_combinations"
import PermissionBasedPolicy from "!/policies/permission-based"
import { semester as permissionGroup } from "$/permissions/permission_list"

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
		return makeResourceIdentifierListDocumentRules(
			"semester",
			exists,
			Manager
		)
	}

	async handle(request: Request, unusedResponse: Response): Promise<NoContentResponseInfo> {
		const manager = new Manager(request)

		const IDs = request.body.data.map((identifier: { id: number }) => identifier.id)
		await manager.archiveBatch(IDs)

		return new NoContentResponseInfo()
	}
}
