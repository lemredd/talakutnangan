import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import JSONController from "!/controllers/json"
import ConsultationManager from "%/managers/consultation"
import NoContentResponseInfo from "!/response_infos/no_content"

import { ARCHIVE_AND_RESTORE } from "$/permissions/department_combinations"
import { department as permissionGroup } from "$/permissions/permission_list"
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
		return makeResourceIdentifierListDocumentRules(
			"consultation",
			exists,
			ConsultationManager
		)
	}

	async handle(request: Request, unusedResponse: Response): Promise<NoContentResponseInfo> {
		const manager = new ConsultationManager(request.transaction, request.cache)

		const IDs = request.body.data.map((identifier: { id: number }) => identifier.id)
		await manager.archiveBatch(IDs)

		return new NoContentResponseInfo()
	}
}
