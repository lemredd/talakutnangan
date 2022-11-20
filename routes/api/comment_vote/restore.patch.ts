import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { OptionalMiddleware } from "!/types/independent"

import Policy from "!/bases/policy"
import JSONController from "!/controllers/json"
import CommentVoteManager from "%/managers/comment_vote"
import NoContentResponseInfo from "!/response_infos/no_content"
import TransactionCommitter from "!/middlewares/miscellaneous/transaction_committer"
import TransactionInitializer from "!/middlewares/miscellaneous/transaction_initializer"

import PermissionBasedPolicy from "!/policies/permission-based"
import { comment as permissionGroup } from "$/permissions/permission_list"
import {
	VOTE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT,
	VOTE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT,
	VOTE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
} from "$/permissions/comment_combinations"
import archived from "!/validators/manager/archived"
import makeResourceIdentifierListDocumentRules
	from "!/rule_sets/make_resource_identifier_list_document"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			VOTE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT,
			VOTE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT,
			VOTE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
		])
	}

	get postValidationMiddlewares(): OptionalMiddleware[] {
		const initializer = new TransactionInitializer()
		return [
			initializer
		]
	}

	makeBodyRuleGenerator(unusedRequest: Request): FieldRules {
		return makeResourceIdentifierListDocumentRules(
			"comment_vote",
			archived,
			CommentVoteManager
		)
	}

	async handle(request: Request, unusedResponse: Response): Promise<NoContentResponseInfo> {
		const manager = new CommentVoteManager(request)

		const IDs = request.body.data.map((identifier: { id: number }) => identifier.id)
		await manager.restoreBatch(IDs)

		return new NoContentResponseInfo()
	}

	get postJobs(): OptionalMiddleware[] {
		return [
			new TransactionCommitter()
		]
	}
}
