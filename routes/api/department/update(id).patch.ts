import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { BaseManagerClass } from "!/types/independent"

import DepartmentManager from "%/managers/department"
import NoContentResponseInfo from "!/response_infos/no_content"
import BoundJSONController from "!/controllers/bound_json_controller"

import { UPDATE } from "$/permissions/department_combinations"
import PermissionBasedPolicy from "!/policies/permission-based"
import { department as permissionGroup } from "$/permissions/permission_list"

import string from "!/validators/base/string"
import boolean from "!/validators/base/boolean"
import regex from "!/validators/comparison/regex"
import unique from "!/validators/manager/unique"
import required from "!/validators/base/required"
import length from "!/validators/comparison/length"
import acronym from "!/validators/comparison/acronym"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"

export default class extends BoundJSONController {
	get filePath(): string { return __filename }

	get policy(): PermissionBasedPolicy<any, any> {
		return new PermissionBasedPolicy(permissionGroup, [
			UPDATE
		])
	}

	makeBodyRuleGenerator(unusedRequest: Request): FieldRules {
		const attributes = {
			"fullName": {
				"pipes": [ required, string, length, regex, unique ],
				"constraints": {
					"length": { "minimum": 10,
						"maximum": 255 },
					"regex": { "match": /([A-Z][a-zA-Z]+ )+[A-Z][a-zA-Z]+$/u },
					"manager": { "className": DepartmentManager,
						"columnName": "fullName" },
					"unique": { "IDPath": "data.id" }
				}
			},
			"acronym": {
				"pipes": [ required, string, length, regex, acronym, unique ],
				"constraints": {
					"length": { "minimum": 2,
						"maximum": 255 },
					"regex": { "match": /([A-Z][a-z]*)+/u },
					"acronym": { "spelledOutPath": "data.attributes.fullName" },
					"manager": { "className": DepartmentManager,
						"columnName": "acronym" },
					"unique": { "IDPath": "data.id" }
				}
			},
			"mayAdmit": {
				"pipes": [ required, boolean ],
				"constraints": {}
			}
		}

		return makeResourceDocumentRules("department", attributes)
	}

	get manager(): BaseManagerClass { return DepartmentManager }

	async handle(request: Request, unusedResponse: Response): Promise<NoContentResponseInfo> {
		const manager = new DepartmentManager(request.transaction, request.cache)
		const id = Number(request.params.id)
		await manager.update(id, request.body.data.attributes)

		return new NoContentResponseInfo()
	}
}
