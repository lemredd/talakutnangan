import type { Rules, FieldRules } from "!/types/validation"
import type { AuthenticatedRequest, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import PostManager from "%/managers/post"
import RoleManager from "%/managers/role"
import MultipartController from "!/controllers/multipart"
import CreatedResponseInfo from "!/response_infos/created"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

import string from "!/validators/base/string"
import same from "!/validators/comparison/same"
import exists from "!/validators/manager/exists"
import nullable from "!/validators/base/nullable"
import required from "!/validators/base/required"
import length from "!/validators/comparison/length"
import makeRelationshipRules from "!/rule_sets/make_relationships"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"

export default class extends MultipartController {
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
			}
		])

		return makeResourceDocumentRules(
			"post",
			attributes,
			{
				"extraDataQueries": relationships,
				"isNew": true,
				"mustCastID": true
			}
		)
	}

	async handle(request: AuthenticatedRequest, unusedResponse: Response)
	: Promise<CreatedResponseInfo> {
		const manager = new PostManager(request)
		const postInfo = await manager.create(request.body.data.attributes)

		return new CreatedResponseInfo(postInfo)
	}
}
