import type { FieldRules } from "!/types/validation"
import type { AuthenticatedRequest, Response } from "!/types/dependent"

import Policy from "!/bases/policy"

import Manager from "%/managers/tag"
import JSONController from "!/controllers/json"
import CreatedResponseInfo from "!/response_infos/created"

import PermissionBasedPolicy from "!/policies/permission-based"
import { tag as permissionGroup } from "$/permissions/permission_list"
import {
	CREATE
} from "$/permissions/tag_combinations"

import string from "!/validators/base/string"
import required from "!/validators/base/required"
import length from "!/validators/comparison/length"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			CREATE
		])
	}

	makeBodyRuleGenerator(unusedAuthenticatedRequest: AuthenticatedRequest): FieldRules {
		const attributes = {
			"name": {
				"constraints": {
					"length": {
						"maximum": 255,
						"minimum": 5
					}
				},
				"pipes": [ required, string, length ]
			}
		}

		return makeResourceDocumentRules("tag", attributes, {
			"isNew": true
		})
	}

	async handle(request: AuthenticatedRequest, unusedResponse: Response)
	: Promise<CreatedResponseInfo> {
		const manager = new Manager(request)
		const tagInfo = await manager.create(request.body.data.attributes)

		return new CreatedResponseInfo(tagInfo)
	}
}
