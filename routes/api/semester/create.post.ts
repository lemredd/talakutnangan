import type { FieldRules } from "!/types/validation"
import type { AuthenticatedRequest, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import { OrderValues } from "$/types/database"
import SemesterManager from "%/managers/semester"
import JSONController from "!/controllers/json"
import CreatedResponseInfo from "!/response_infos/created"

import { CREATE } from "$/permissions/semester_combinations"
import PermissionBasedPolicy from "!/policies/permission-based"
import { semester as permissionGroup } from "$/permissions/permission_list"

import date from "!/validators/base/date"
import string from "!/validators/base/string"
import required from "!/validators/base/required"
import oneOf from "!/validators/comparison/one-of"
import length from "!/validators/comparison/length"
import isLessThan from "!/validators/comparison/is_less_than"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			CREATE
		])
	}

	makeBodyRuleGenerator(unusedAuthenticatedRequest: AuthenticatedRequest): FieldRules {
		const attributes: FieldRules = {
			"endAt": {
				"friendlyName": "end at",
				"pipes": [ required, string, date ]
			},
			"name": {
				"constraints": {
					"length": {
						"maximum": 255,
						"minimum": 10
					}
				},
				"friendlyName": "semester name",
				"pipes": [ required, string, length ]
			},
			"semesterOrder": {
				"constraints": {
					"oneOf": {
						"values": [ ...OrderValues ]
					}
				},
				"friendlyName": "order",
				"pipes": [ required, string, oneOf ]
			},
			"startAt": {
				"constraints": {
					"isLessThan": {
						"pointer": "data.attributes.endAt"
					}
				},
				"friendlyName": "start at",
				"pipes": [ required, string, date, isLessThan ]
			}
		}

		return makeResourceDocumentRules("semester", attributes, { "isNew": true }
		)
	}

	async handle(request: AuthenticatedRequest, unusedResponse: Response)
	: Promise<CreatedResponseInfo> {
		const manager = new SemesterManager(request)
		const semesterInfo = await manager.create(request.body.data.attributes)

		return new CreatedResponseInfo(semesterInfo)
	}
}
