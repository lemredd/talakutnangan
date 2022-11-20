import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { OptionalMiddleware } from "!/types/independent"

import Policy from "!/bases/policy"
import Manager from "%/managers/tag"
import JSONController from "!/controllers/json"
import NoContentResponseInfo from "!/response_infos/no_content"
import TransactionCommitter from "!/middlewares/miscellaneous/transaction_committer"
import TransactionInitializer from "!/middlewares/miscellaneous/transaction_initializer"

import PermissionBasedPolicy from "!/policies/permission-based"
import { tag as permissionGroup } from "$/permissions/permission_list"
import {
	ARCHIVE_AND_RESTORE
} from "$/permissions/tag_combinations"

import exists from "!/validators/manager/exists"
import hasNoOtherPosts from "!/validators/manager/has_no_other_posts"
import makeResourceIdentifierListDocumentRules
	from "!/rule_sets/make_resource_identifier_list_document"


export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			ARCHIVE_AND_RESTORE
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
			"tag",
			exists,
			Manager,
			{
				"postIDRules": { "pipes": [ hasNoOtherPosts ] }
			}
		)
	}

	async handle(request: Request, unusedResponse: Response): Promise<NoContentResponseInfo> {
		const manager = new Manager(request)

		const IDs = request.body.data.map((identifier: { id: number }) => identifier.id)
		await manager.archiveBatch(IDs)

		return new NoContentResponseInfo()
	}

	get postJobs(): OptionalMiddleware[] {
		return [
			new TransactionCommitter()
		]
	}
}
