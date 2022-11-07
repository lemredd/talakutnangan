import type { Rules, FieldRules } from "!/types/validation"
import type { AuthenticatedRequest, Response, BaseManagerClass } from "!/types/dependent"

import Policy from "!/bases/policy"
import Manager from "%/managers/comment"
import PermissionBasedPolicy from "!/policies/permission-based"
import NoContentResponseInfo from "!/response_infos/no_content"
import DoubleBoundJSONController from "!/controllers/double_bound_json"
import { comment as permissionGroup } from "$/permissions/permission_list"
import {
	UPDATE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT,
	UPDATE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT,
	UPDATE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
} from "$/permissions/comment_combinations"

import same from "!/validators/comparison/same"
import nullable from "!/validators/base/nullable"
import string from "!/validators/base/string"
import required from "!/validators/base/required"
import length from "!/validators/comparison/length"
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

		return makeResourceDocumentRules(
			"comment",
			attributes,
			{
				"isNew": false
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
