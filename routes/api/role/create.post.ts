import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"

import { roleName, roleNameDescription } from "$!/constants/regex"

import Policy from "!/bases/policy"
import RoleManager from "%/managers/role"
import JSONController from "!/controllers/json"

import { CREATE } from "$/permissions/role_combinations"
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
import regex from "!/validators/comparison/regex"
import required from "!/validators/base/required"
import makeFlagRules from "!/rule_sets/make_flag"
import notExists from "!/validators/manager/not_exists"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			CREATE
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
					"regex": {
						"friendlyDescription": roleNameDescription,
						"match": roleName
					}
				},
				"friendlyName": "Role name",
				"pipes": [ required, string, regex, notExists ]
			},
			...makeFlagRules("semesterFlags", semester),
			...makeFlagRules("tagFlags", tag),
			...makeFlagRules("postFlags", post),
			...makeFlagRules("commentFlags", comment),
			...makeFlagRules("profanityFlags", profanity),
			...makeFlagRules("userFlags", user),
			...makeFlagRules("auditTrailFlags", auditTrail)
		}

		return makeResourceDocumentRules("role", attributes, {
			"isNew": true
		})
	}

	async handle(request: Request, response: Response): Promise<void> {
		const manager = new RoleManager(request)
		request.body.data.attributes.departmentFlags = 1
		request.body.data.attributes.roleFlags = 1
		const roleInfo = await manager.create(request.body.data.attributes)

		response.status(this.status.CREATED).json(roleInfo)
	}
}
