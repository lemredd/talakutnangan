import type { FieldRules } from "!/types/validation"
import type { AuthenticatedRequest, Response, BaseManagerClass } from "!/types/dependent"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import Manager from "%/managers/comment_vote"
import CommentManager from "%/managers/comment"
import { VoteKindValues } from "$/types/database"
import NoContentResponseInfo from "!/response_infos/no_content"
import DoubleBoundJSONController from "!/controllers/double_bound_json"

import PermissionBasedPolicy from "!/policies/permission-based"
import { comment as permissionGroup } from "$/permissions/permission_list"
import {
	UPDATE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT,
	UPDATE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT,
	UPDATE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
} from "$/permissions/comment_combinations"

import string from "!/validators/base/string"
import exists from "!/validators/manager/exists"
import required from "!/validators/base/required"
import oneOf from "!/validators/comparison/one-of"
import makeRelationshipRules from "!/rule_sets/make_relationships"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"

export default class extends DoubleBoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			UPDATE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT,
			UPDATE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT,
			UPDATE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
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
				"typeName": "post",
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

	get manager(): BaseManagerClass { return Manager }

	async handle(request: AuthenticatedRequest, unusedResponse: Response)
	: Promise<NoContentResponseInfo> {
		const manager = new Manager(request)
		const { id } = request.params
		await manager.update(Number(id), request.body.data.attributes)

		return new NoContentResponseInfo()
	}
}
