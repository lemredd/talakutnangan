import type { FieldRules } from "!/types/validation"
import type { OptionalMiddleware } from "!/types/independent"
import type { DeserializedUserDocument } from "$/types/documents/user"
import type { TagIdentifierListDocument } from "$/types/documents/tag"
import type { DeserializedPostDocument } from "$/types/documents/post"
import type { AuthenticatedIDRequest, Response, BaseManagerClass } from "!/types/dependent"

import Log from "$!/singletons/log"
import Policy from "!/bases/policy"
import Manager from "%/managers/tag"
import PostManager from "%/managers/post"
import UserManager from "%/managers/user"
import deserialize from "$/object/deserialize"
import BoundJSONController from "!/controllers/bound_json"
import NoContentResponseInfo from "!/response_infos/no_content"
import TransactionCommitter from "!/middlewares/miscellaneous/transaction_committer"
import TransactionInitializer from "!/middlewares/miscellaneous/transaction_initializer"

import ScopeBasedPolicy from "!/policies/scope-based"
import { post as permissionGroup } from "$/permissions/permission_list"
import {
	TAG_SOCIAL_POST_ON_OWN_DEPARTMENT,
	TAG_PUBLIC_POST_ON_ANY_DEPARTMENT,
	TAG_PERSONAL_POST_ON_OWN_DEPARTMENT
} from "$/permissions/post_combinations"

import exists from "!/validators/manager/exists"
import makeResourceIdentifierListDocumentRules
	from "!/rule_sets/make_resource_identifier_list_document"

export default class extends BoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new ScopeBasedPolicy(
			permissionGroup,
			TAG_PERSONAL_POST_ON_OWN_DEPARTMENT,
			TAG_SOCIAL_POST_ON_OWN_DEPARTMENT,
			TAG_PUBLIC_POST_ON_ANY_DEPARTMENT,
			async(request: AuthenticatedIDRequest) => {
				const postManager = new PostManager(request)
				const id = Number(request.params.id)
				const document = await postManager.findWithID(id)
				const deserializedDocument = deserialize(document) as DeserializedPostDocument<
					"poster"|"department"
				>
				// ! Some owners have been moved in different department
				const owner = deserializedDocument.data.poster as DeserializedUserDocument<
					"roles"|"department"
				>
				owner.data.department = deserializedDocument.data.department
				if (!owner.data.department) {
					const userManager = new UserManager(request)
					const completeInfo = await userManager.findWithID(Number(
						deserializedDocument.data.poster.data.id
					))
					const deserializedCompleteInfo = deserialize(
						completeInfo
					) as DeserializedUserDocument<"roles"|"department">
					owner.data.department = deserializedCompleteInfo.data.department
					owner.data.roles = deserializedCompleteInfo.data.roles
				}

				return deserialize(owner) as DeserializedUserDocument<"roles"|"department">
			}
		)
	}

	makeBodyRuleGenerator(unusedRequest: AuthenticatedIDRequest): FieldRules {
		return makeResourceIdentifierListDocumentRules("tag", exists, Manager)
	}

	get manager(): BaseManagerClass { return PostManager }

	get postValidationMiddlewares(): OptionalMiddleware[] {
		const initializer = new TransactionInitializer()
		return [
			initializer
		]
	}

	async handle(request: AuthenticatedIDRequest, unusedResponse: Response)
	: Promise<NoContentResponseInfo> {
		const manager = new Manager(request)
		const { data } = request.body as TagIdentifierListDocument<"read">
		const { id } = request.params
		const postID = Number(id)

		await manager.reattach(postID, data.map(identifier => Number(identifier.id)))
		Log.success("controller", "successfully updated the tags of the post")

		return new NoContentResponseInfo()
	}

	get postJobs(): OptionalMiddleware[] {
		return [
			new TransactionCommitter()
		]
	}
}
