import type { Rules, FieldRules } from "!/types/validation"
import type { AuthenticatedRequest, Response } from "!/types/dependent"

import { postContent, postContentDescription } from "$!/constants/regex"

import Policy from "!/bases/policy"
import JSONController from "!/controllers/json"
import CreatedResponseInfo from "!/response_infos/created"

import Manager from "%/managers/post"
import TagManager from "%/managers/tag"
import UserManager from "%/managers/user"
import RoleManager from "%/managers/role"
import DepartmentManager from "%/managers/department"
import PostAttachmentManager from "%/managers/post_attachment"

import PermissionBasedPolicy from "!/policies/permission-based"
import { post as permissionGroup } from "$/permissions/permission_list"
import {
	CREATE_SOCIAL_POST_ON_OWN_DEPARTMENT,
	CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT,
	CREATE_PERSONAL_POST_ON_OWN_DEPARTMENT
} from "$/permissions/post_combinations"

import string from "!/validators/base/string"
import same from "!/validators/comparison/same"
import exists from "!/validators/manager/exists"
import nullable from "!/validators/base/nullable"
import required from "!/validators/base/required"
import regex from "!/validators/comparison/regex"
import length from "!/validators/comparison/length"
import makeRelationshipRules from "!/rule_sets/make_relationships"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			CREATE_SOCIAL_POST_ON_OWN_DEPARTMENT,
			CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT,
			CREATE_PERSONAL_POST_ON_OWN_DEPARTMENT
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

		const attributes: FieldRules = {
			"approvedAt": pureNull,
			"content": {
				"constraints": {
					"length": {
						"maximum": 2000,
						"minimum": 5
					},
					"regex": {
						"friendlyDescription": postContentDescription,
						"match": postContent
					}
				},
				"friendlyName": "content",
				"pipes": [ required, string, length, regex ]
			}
		}

		const relationships: FieldRules = makeRelationshipRules([
			{
				"ClassName": UserManager,
				"isArray": false,
				"relationshipName": "poster",
				"typeName": "user",
				"validator": exists
			},
			{
				"ClassName": RoleManager,
				"isArray": false,
				"relationshipName": "posterRole",
				"typeName": "role",
				"validator": exists
			},
			{
				"ClassName": PostAttachmentManager,
				"isArray": true,
				"isOptional": true,
				"relationshipName": "postAttachments",
				"typeName": "post_attachment",
				"validator": exists
			},
			{
				"ClassName": DepartmentManager,
				"isArray": false,
				"isOptional": true,
				"relationshipName": "department",
				"typeName": "department",
				"validator": exists
			},
			{
				"ClassName": TagManager,
				"isArray": true,
				"isOptional": true,
				"relationshipName": "tags",
				"typeName": "tag",
				"validator": exists
			}
		])

		return makeResourceDocumentRules(
			"post",
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
		const postInfo = await manager.createUsingResource(request.body.data)

		return new CreatedResponseInfo(postInfo)
	}
}
