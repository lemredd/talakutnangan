import type { Request, Response } from "!/types/dependent"
import type { FieldRules } from "!/types/validation"

import UserManager from "%/managers/user"
import JSONController from "!/controllers/json"
import NoContentResponseInfo from "!/response_infos/no_content"
import ActionAuditor from "!/middlewares/miscellaneous/action_auditor"

import PermissionBasedPolicy from "!/policies/permission-based"
import { ARCHIVE_AND_RESTORE } from "$/permissions/department_combinations"
import { user as permissionGroup } from "$/permissions/permission_list"

import archived from "!/validators/manager/archived"
import makeResourceIdentifierListDocumentRules
	from "!/rule_sets/make_resource_identifier_list_document"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): PermissionBasedPolicy<any, any> {
		return new PermissionBasedPolicy(permissionGroup, [
			ARCHIVE_AND_RESTORE
		])
	}

	makeBodyRuleGenerator(unusedRequest: Request): FieldRules {
		return makeResourceIdentifierListDocumentRules("user", archived, UserManager)
	}

	async handle(request: Request, unusedResponse: Response): Promise<NoContentResponseInfo> {
		const manager = new UserManager(request)

		const IDs = request.body.data.map((identifier: { id: number }) => identifier.id)
		await manager.restoreBatch(IDs)

		return new NoContentResponseInfo()
	}

	get postJobs(): ActionAuditor[] {
		return [
			new ActionAuditor("user.restore")
		]
	}
}
