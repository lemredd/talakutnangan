import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { BaseManagerClass } from "!/types/dependent"

import DepartmentManager from "%/managers/department"
import NoContentResponseInfo from "!/response_infos/no_content"
import DoubleBoundJSONController from "!/controllers/double_bound_json"

import { UPDATE } from "$/permissions/department_combinations"
import PermissionBasedPolicy from "!/policies/permission-based"
import { department as permissionGroup } from "$/permissions/permission_list"

import object from "!/validators/base/object"
import string from "!/validators/base/string"
import boolean from "!/validators/base/boolean"
import unique from "!/validators/manager/unique"
import regex from "!/validators/comparison/regex"
import required from "!/validators/base/required"
import length from "!/validators/comparison/length"
import acronym from "!/validators/comparison/acronym"
import matchesPassword from "!/validators/manager/matches_password"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"

export default class extends DoubleBoundJSONController {
	get filePath(): string { return __filename }

	get policy(): PermissionBasedPolicy<any, any> {
		return new PermissionBasedPolicy(permissionGroup, [
			UPDATE
		])
	}

	makeBodyRuleGenerator(unusedRequest: Request): FieldRules {
		const attributes = {
			"fullName": {
				"constraints": {
					"length": {
						"maximum": 255,
						"minimum": 10
					},
					"manager": {
						"className": DepartmentManager,
						"columnName": "fullName"
					},
					"regex": { "match": /([A-Z][a-zA-Z]+ )+[A-Z][a-zA-Z]+$/u },
					"unique": { "IDPath": "data.id" }
				},
				"pipes": [ required, string, length, regex, unique ]
			},
			"acronym": {
				"constraints": {
					"acronym": { "spelledOutPath": "data.attributes.fullName" },
					"length": {
						"maximum": 255,
						"minimum": 2
					},
					"manager": {
						"className": DepartmentManager,
						"columnName": "acronym"
					},
					"regex": { "match": /([A-Z][a-z]*)+/u },
					"unique": { "IDPath": "data.id" }
				},
				"pipes": [ required, string, length, regex, acronym, unique ]
			},
			"mayAdmit": {
				"pipes": [ required, boolean ]
			}
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

		return makeResourceDocumentRules("department", attributes, {
			"extraQueries": { meta }
		})
	}

	get manager(): BaseManagerClass { return DepartmentManager }

	async handle(request: Request, unusedResponse: Response): Promise<NoContentResponseInfo> {
		const manager = new DepartmentManager(request)
		const id = Number(request.params.id)
		await manager.update(id, request.body.data.attributes)

		return new NoContentResponseInfo()
	}
}
