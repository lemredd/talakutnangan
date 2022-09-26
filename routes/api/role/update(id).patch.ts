import type { FieldRules } from "!/types/validation"
import type { Request, Response, BaseManagerClass } from "!/types/dependent"

import Policy from "!/bases/policy"
import RoleManager from "%/managers/role"
import NoContentResponseInfo from "!/response_infos/no_content"
import DoubleBoundJSONController from "!/controllers/double_bound_json"

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

import object from "!/validators/base/object"
import string from "!/validators/base/string"
import unique from "!/validators/manager/unique"
import regex from "!/validators/comparison/regex"
import required from "!/validators/base/required"
import makeFlagRules from "!/rule_sets/make_flag"
import matchesPassword from "!/validators/manager/matches_password"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"

export default class extends DoubleBoundJSONController {
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

		const meta = {
			"constraints": {
				"object": {
					"password": {
						"pipes": [ required, string, matchesPassword ]
					}
				}
			},
			"pipes": [ required, object ]
		}

		return makeResourceDocumentRules("role", attributes, {
			"extraQueries": { meta }
		})
	}

	get manager(): BaseManagerClass { return RoleManager }

	async handle(request: Request, unusedResponse: Response): Promise<NoContentResponseInfo> {
		const manager = new RoleManager(request)
		const { id, attributes } = request.body.data

		await manager.update(Number(id), attributes)

		return new NoContentResponseInfo()
	}
}
