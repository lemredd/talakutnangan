import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"

import JSONController from "!/controllers/json"
import NoContentResponseInfo from "!/response_infos/no_content"
import CommentActivityManager from "%/managers/comment"

import PermissionBasedPolicy from "!/policies/permission-based"
import { comment as permissionGroup } from "$/permissions/permission_list"
import {
	ARCHIVE_AND_RESTORE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT,
	ARCHIVE_AND_RESTORE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT,
	ARCHIVE_AND_RESTORE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
} from "$/permissions/comment_combinations"

import exists from "!/validators/manager/exists"
import makeResourceIdentifierListDocumentRules
	from "!/rule_sets/make_resource_identifier_list_document"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): PermissionBasedPolicy<any, any> {
		return new PermissionBasedPolicy(permissionGroup, [
			ARCHIVE_AND_RESTORE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT,
			ARCHIVE_AND_RESTORE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT,
			ARCHIVE_AND_RESTORE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
		])
	}

	makeBodyRuleGenerator(unusedRequest: Request): FieldRules {
		return makeResourceIdentifierListDocumentRules(
			"comment",
			exists,
			CommentActivityManager
		)
	}

	async handle(request: Request, unusedResponse: Response): Promise<NoContentResponseInfo> {
		const manager = new CommentActivityManager(request)

		const IDs = request.body.data.map((identifier: { id: number }) => identifier.id)
		await manager.archiveBatch(IDs)

		return new NoContentResponseInfo()
	}
}
