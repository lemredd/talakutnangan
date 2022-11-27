import type { FieldRules } from "!/types/validation"
import type { AuthenticatedRequest, Response, BaseManagerClass } from "!/types/dependent"

import Policy from "!/bases/policy"
import { OrderValues } from "$/types/database"
import SemesterManager from "%/managers/semester"
import BoundJSONController from "!/controllers/bound_json"
import NoContentResponseInfo from "!/response_infos/no_content"

import { UPDATE } from "$/permissions/semester_combinations"
import PermissionBasedPolicy from "!/policies/permission-based"
import { semester as permissionGroup } from "$/permissions/permission_list"

import date from "!/validators/base/date"
import string from "!/validators/base/string"
import required from "!/validators/base/required"
import oneOf from "!/validators/comparison/one-of"
import length from "!/validators/comparison/length"
import isLessThan from "!/validators/comparison/is_less_than"
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


		return makeResourceDocumentRules("semester", attributes)
	}

	get manager(): BaseManagerClass { return SemesterManager }

	async handle(request: AuthenticatedRequest, unusedResponse: Response)
	: Promise<NoContentResponseInfo> {
		const manager = new SemesterManager(request)
		const { id } = request.params
		await manager.update(Number(id), request.body.data.attributes)

		return new NoContentResponseInfo()
	}
}
