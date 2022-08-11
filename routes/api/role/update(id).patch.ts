import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { BaseManagerClass } from "!/types/independent"

import Policy from "!/bases/policy"
import RoleManager from "%/managers/role"
import NoContentResponseInfo from "!/response_infos/no_content"
import BoundJSONController from "!/controllers/bound_json_controller"

import { UPDATE } from "$/permissions/role_combinations"
import PermissionBasedPolicy from "!/policies/permission-based"
import {
	tag,
	user,
	role as permissionGroup,
	post,
	comment,
	semester,
	profanity,
	auditTrail
} from "$/permissions/permission_list"

import string from "!/validators/base/string"
import unique from "!/validators/manager/unique"
import regex from "!/validators/comparison/regex"
import required from "!/validators/base/required"
import makeFlagRules from "!/rule_sets/make_flag"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"

export default class extends BoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			UPDATE
		])
	}

	makeBodyRuleGenerator(unusedRequest: Request): FieldRules {
		const attributes: FieldRules = {
			"name": {
				"constraints": {
					"manager": {
						"className": RoleManager,
						"columnName": "name"
					},
					"regex": { "match": /^([A-Z][a-z-_]+ )*[A-Z][a-z-_]+$/u },
					"unique": {
						"IDPath": "data.id"
					}
				},
				"pipes": [ required, string, regex, unique ]
			},
			...makeFlagRules("semesterFlags", semester),
			...makeFlagRules("tagFlags", tag),
			...makeFlagRules("postFlags", post),
			...makeFlagRules("commentFlags", comment),
			...makeFlagRules("profanityFlags", profanity),
			...makeFlagRules("userFlags", user),
			...makeFlagRules("auditTrailFlags", auditTrail)
		}

		return makeResourceDocumentRules("role", attributes)
	}

	get manager(): BaseManagerClass { return RoleManager }

	async handle(request: Request, unusedResponse: Response): Promise<NoContentResponseInfo> {
		const manager = new RoleManager(request.transaction, request.cache)
		const { id, attributes } = request.body.data

		await manager.update(Number(id), attributes)

		return new NoContentResponseInfo()
	}
}
