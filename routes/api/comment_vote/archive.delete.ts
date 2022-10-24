import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"

import JSONController from "!/controllers/json"
import NoContentResponseInfo from "!/response_infos/no_content"
import CommentVoteActivityManager from "%/managers/comment_vote"

import PermissionBasedPolicy from "!/policies/permission-based"
import { comment as permissionGroup } from "$/permissions/permission_list"
import {
	VOTE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT,
	VOTE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT,
	VOTE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
} from "$/permissions/comment_combinations"

import exists from "!/validators/manager/exists"
import makeResourceIdentifierListDocumentRules
	from "!/rule_sets/make_resource_identifier_list_document"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): PermissionBasedPolicy<any, any> {
		return new PermissionBasedPolicy(permissionGroup, [
			VOTE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT,
			VOTE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT,
			VOTE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
		])
	}

	makeBodyRuleGenerator(unusedRequest: Request): FieldRules {
		return makeResourceIdentifierListDocumentRules(
			"comment_vote",
			exists,
			CommentVoteActivityManager
		)
	}

	async handle(request: Request, unusedResponse: Response): Promise<NoContentResponseInfo> {
		const manager = new CommentVoteActivityManager(request)

		const IDs = request.body.data.map((identifier: { id: number }) => identifier.id)
		await manager.archiveBatch(IDs)

		return new NoContentResponseInfo()
	}
}
