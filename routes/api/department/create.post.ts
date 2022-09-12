import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"

import DepartmentManager from "%/managers/department"
import CreatedResponseInfo from "!/response_infos/created"
import JSONController from "!/controllers/json"

import { CREATE } from "$/permissions/department_combinations"
import PermissionBasedPolicy from "!/policies/permission-based"
import { department as permissionGroup } from "$/permissions/permission_list"

import string from "!/validators/base/string"
import boolean from "!/validators/base/boolean"
import regex from "!/validators/comparison/regex"
import required from "!/validators/base/required"
import length from "!/validators/comparison/length"
import acronym from "!/validators/comparison/acronym"
import notExists from "!/validators/manager/not_exists"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"


export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): PermissionBasedPolicy<any, any> {
		return new PermissionBasedPolicy(permissionGroup, [
			CREATE
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
					"regex": { "match": /([A-Z][a-zA-Z]+ )+[A-Z][a-zA-Z]+$/u }
				},
				"pipes": [ required, string, length, regex, notExists ]
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
						"columnName": "fullName"
					},
					"regex": { "match": /([A-Z][a-z]*)+/u }
				},
				"pipes": [ required, string, length, regex, acronym, notExists ]
			},
			"mayAdmit": {
				"pipes": [ required, boolean ]
			}
		}

		return makeResourceDocumentRules("department", attributes, {
			"isNew": true
		})
	}

	async handle(request: Request, unusedResponse: Response): Promise<CreatedResponseInfo> {
		const manager = new DepartmentManager(request)
		const departmentInfo = await manager.create(request.body.data.attributes)

		return new CreatedResponseInfo(departmentInfo)
	}
}
