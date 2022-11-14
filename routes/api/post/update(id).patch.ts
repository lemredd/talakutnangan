import type { Rules, FieldRules } from "!/types/validation"
import type { DeserializedUserDocument } from "$/types/documents/user"
import type { AuthenticatedRequest, Response, BaseManagerClass } from "!/types/dependent"

import { postContent, postContentDescription } from "$!/constants/regex"

import Policy from "!/bases/policy"
import Manager from "%/managers/post"
import deserialize from "$/object/deserialize"
import Merger from "!/middlewares/miscellaneous/merger"
import NoContentResponseInfo from "!/response_infos/no_content"
import DoubleBoundJSONController from "!/controllers/double_bound_json"

import ScopeBasedPolicy from "!/policies/scope-based"
import PermissionBasedPolicy from "!/policies/permission-based"
import { post as permissionGroup } from "$/permissions/permission_list"
import {
	UPDATE_SOCIAL_POST_ON_OWN_DEPARTMENT,
	UPDATE_PUBLIC_POST_ON_ANY_DEPARTMENT,
	UPDATE_PERSONAL_POST_ON_OWN_DEPARTMENT
} from "$/permissions/post_combinations"

import string from "!/validators/base/string"
import same from "!/validators/comparison/same"
import required from "!/validators/base/required"
import nullable from "!/validators/base/nullable"
import regex from "!/validators/comparison/regex"
import length from "!/validators/comparison/length"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"

export default class extends DoubleBoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new Merger([
			new PermissionBasedPolicy(permissionGroup, [
				UPDATE_SOCIAL_POST_ON_OWN_DEPARTMENT,
				UPDATE_PUBLIC_POST_ON_ANY_DEPARTMENT,
				UPDATE_PERSONAL_POST_ON_OWN_DEPARTMENT
			]),
			new ScopeBasedPolicy(
				permissionGroup,
				UPDATE_PERSONAL_POST_ON_OWN_DEPARTMENT,
				UPDATE_PUBLIC_POST_ON_ANY_DEPARTMENT,
				UPDATE_SOCIAL_POST_ON_OWN_DEPARTMENT,
				(request: AuthenticatedRequest) => Promise.resolve(
					deserialize(request.user) as DeserializedUserDocument<"roles"|"department">
				)
			)
		]) as unknown as Policy
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
						"maximum": 1000,
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

		return makeResourceDocumentRules("post", attributes)
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
