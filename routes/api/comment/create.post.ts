import type { Rules, FieldRules } from "!/types/validation"
import type { AuthenticatedRequest, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import PostManager from "%/managers/post"
import UserManager from "%/managers/user"
import Manager from "%/managers/comment"
import JSONController from "!/controllers/json"
import CreatedResponseInfo from "!/response_infos/created"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

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
		return CommonMiddlewareList.studentOnlyPolicy
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
				"ClassName": UserManager,
				"isOptional": true,
				"isArray": false,
				"relationshipName": "comment",
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
		const commentInfo = await manager.create(request.body.data.attributes)

		return new CreatedResponseInfo(commentInfo)
	}
}
