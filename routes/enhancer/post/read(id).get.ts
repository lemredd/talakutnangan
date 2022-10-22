import type { DocumentProps } from "$/types/server"
import type { Serializable } from "$/types/general"
import type { PostDocument } from "$/types/documents/post"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { CommentListDocument } from "$/types/documents/comment"
import type { DeserializedUserDocument } from "$/types/documents/user"

import Policy from "!/bases/policy"
import Manager from "%/managers/post"
import Validation from "!/bases/validation"
import deserialize from "$/object/deserialize"
import CommentManager from "%/managers/comment"
import present from "!/validators/manager/present"
import IDParameterValidation from "!/validations/id_parameter"
import PageMiddleware from "!/bases/controller-likes/page_middleware"

import ScopeBasedPolicy from "!/policies/scope-based"
import { post as permissionGroup } from "$/permissions/permission_list"
import {
	READ_ANYONE_ON_OWN_DEPARTMENT,
	READ_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/post_combinations"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new ScopeBasedPolicy(
			permissionGroup,
			[],
			READ_ANYONE_ON_OWN_DEPARTMENT,
			READ_ANYONE_ON_ALL_DEPARTMENTS,
			(request: AuthenticatedRequest) => Promise.resolve(
				deserialize(request.user) as DeserializedUserDocument<"roles"|"department">
			)
		)
	}

	get validations(): Validation[] {
		return [
			new IDParameterValidation([
				[ "id", Manager, present ]
			])
		]
	}

	getDocumentProps(): DocumentProps {
		return {
			"description": "Post chat platform for MCC",
			"title": "Post | Talakutnangan"
		}
	}

	async getPageProps(request: AuthenticatedRequest): Promise<Serializable> {
		const { id } = request.params
		const manager = new Manager(request)
		const commentManager = new CommentManager(request)

		const post = await manager.findWithID(Number(id), {
			"constraints": {
				"filter": {
					"existence": "exists"
				}
			}
		}) as PostDocument
		const comments = await commentManager.list({
			"filter": {
				"existence": "exists"
			},
			"page": {
				"limit": 10,
				"offset": 0
			},
			"sort": [ "-createdAt" ]
		}) as CommentListDocument

		return {
			comments,
			post
		}
	}
}
