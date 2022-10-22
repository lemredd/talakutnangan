import type { Rules, FieldRules } from "!/types/validation"
import type { AuthenticatedRequest, Response } from "!/types/dependent"
import type { CommentAttributes, CommentRelationships } from "$/types/documents/comment"

import Policy from "!/bases/policy"
import Manager from "%/managers/comment"
import PostManager from "%/managers/post"
import UserManager from "%/managers/user"
import JSONController from "!/controllers/json"
import CreatedResponseInfo from "!/response_infos/created"

import PermissionBasedPolicy from "!/policies/permission-based"
import { comment as permissionGroup } from "$/permissions/permission_list"
import {
	CREATE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT,
	CREATE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT,
	CREATE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
} from "$/permissions/comment_combinations"

import same from "!/validators/comparison/same"
import exists from "!/validators/manager/exists"
import nullable from "!/validators/base/nullable"
import string from "!/validators/base/string"
import required from "!/validators/base/required"
import length from "!/validators/comparison/length"
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
		const pureNull: Rules = {
			"constraints": {
				"nullable": {
					"defaultValue": null
				},
				"same": {
					"value": null
				}
			},
			"pipes": [ nullable, same ]
		}

		const attributes = {
			"approvedAt": pureNull,
			"content": {
				"constraints": {
					"length": {
						"maximum": 1000,
						"minimum": 5
					}
				},
				"pipes": [ required, string, length ]
			}
		}

		const relationships: FieldRules = makeRelationshipRules([
			{
				"ClassName": PostManager,
				"isArray": false,
				"relationshipName": "post",
				"typeName": "post",
				"validator": exists
			},
			{
				"ClassName": UserManager,
				"isArray": false,
				"relationshipName": "user",
				"typeName": "user",
				"validator": exists
			},
			{
				"ClassName": Manager,
				"isArray": false,
				"isOptional": true,
				"relationshipName": "parentComment",
				"typeName": "comment",
				"validator": exists
			}
		])

		return makeResourceDocumentRules(
			"comment",
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
		const attributes = request.body.data.attributes as CommentAttributes<"deserialized">
		const relationships = request.body.data.relationships as CommentRelationships<
			"create"
		>["relationships"]
		const commentInfo = await manager.create({
			...attributes,
			"parentCommentID": relationships.parentComment?.data.id ?? null,
			"postID": relationships.post.data.id,
			"userID": relationships.user.data.id
		})

		return new CreatedResponseInfo(commentInfo)
	}
}
