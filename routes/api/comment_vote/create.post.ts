import type { FieldRules } from "!/types/validation"
import type { AuthenticatedRequest, Response } from "!/types/dependent"
import type {
	CommentVoteRelationships,
	CommentVoteAttributes
} from "$/types/documents/comment_vote"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import Manager from "%/managers/comment_vote"
import CommentManager from "%/managers/comment"
import JSONController from "!/controllers/json"
import { VoteKindValues } from "$/types/database"
import CreatedResponseInfo from "!/response_infos/created"

import PermissionBasedPolicy from "!/policies/permission-based"
import { comment as permissionGroup } from "$/permissions/permission_list"
import {
	CREATE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT,
	CREATE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT,
	CREATE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
} from "$/permissions/comment_combinations"

import string from "!/validators/base/string"
import exists from "!/validators/manager/exists"
import required from "!/validators/base/required"
import oneOf from "!/validators/comparison/one-of"
import makeRelationshipRules from "!/rule_sets/make_relationships"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			CREATE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT,
			CREATE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT,
			CREATE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
		])
	}

	makeBodyRuleGenerator(unusedAuthenticatedRequest: AuthenticatedRequest): FieldRules {
		const attributes = {
			"kind": {
				"constraints": {
					"oneOf": {
						"values": [ ...VoteKindValues ]
					}
				},
				"pipes": [ required, string, oneOf ]
			}
		}

		const relationships: FieldRules = makeRelationshipRules([
			{
				"ClassName": CommentManager,
				"isArray": false,
				"relationshipName": "comment",
				"typeName": "comment",
				"validator": exists
			},
			{
				"ClassName": UserManager,
				"isArray": false,
				"relationshipName": "user",
				"typeName": "user",
				"validator": exists
			}
		])

		return makeResourceDocumentRules(
			"comment_vote",
			attributes,
			{
				"extraDataQueries": relationships,
				"isNew": true
			}
		)
	}

	async handle(request: AuthenticatedRequest, unusedResponse: Response)
	: Promise<CreatedResponseInfo> {
		const manager = new Manager(request)
		const attributes = request.body.data.attributes as CommentVoteAttributes
		const data = request.body.data as CommentVoteRelationships
		const commentInfo = await manager.create({
			...attributes,
			"commentID": Number(data.relationships.comment.data.id),
			"userID": Number(data.relationships.user.data.id)
		})

		return new CreatedResponseInfo(commentInfo)
	}
}
