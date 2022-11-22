import type { FieldRules } from "!/types/validation"
import type { AuthenticatedRequest, Response, BaseManagerClass } from "!/types/dependent"

import Policy from "!/bases/policy"

import Manager from "%/managers/profanity_filter"
import BoundJSONController from "!/controllers/bound_json"
import NoContentResponseInfo from "!/response_infos/no_content"

import PermissionBasedPolicy from "!/policies/permission-based"
import { profanity as permissionGroup } from "$/permissions/permission_list"
import {
	UPDATE
} from "$/permissions/profanity_combinations"

import string from "!/validators/base/string"
import required from "!/validators/base/required"
import length from "!/validators/comparison/length"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"

export default class extends BoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			UPDATE
		])
	}

	makeBodyRuleGenerator(unusedAuthenticatedRequest: AuthenticatedRequest): FieldRules {
		const attributes = {
			"word": {
				"constraints": {
					"length": {
						"maximum": 255,
						"minimum": 5
					}
				},
				"pipes": [ required, string, length ]
			}
		}

		return makeResourceDocumentRules("profanity_filter", attributes, {
			"isNew": true
		})
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
