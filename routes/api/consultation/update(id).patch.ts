import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { BaseManagerClass } from "!/types/independent"

import Policy from "!/bases/policy"
import AttachedRoleManager from "%/managers/role"
import ConsultationManager from "%/managers/consultation"
import NoContentResponseInfo from "!/response_infos/no_content"
import DoubleBoundJSONController from "!/controllers/double_bound_json"

import { UPDATE } from "$/permissions/department_combinations"
import { department as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/policies/permission-based"

import string from "!/validators/base/string"
import exists from "!/validators/manager/exists"
import required from "!/validators/base/required"
import oneOf from "!/validators/comparison/one-of"
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
			"actionTaken": {
				"constraints": { },
				"pipes": [ required, string ]
			},
			"attachedRoleID": {
				"constraints": {
					"manager": {
						"className": AttachedRoleManager,
						"columnName": "id"
					}
				},
				"pipes": [ required, exists ]
			},
			"reason": {
				"constraints": { },
				"pipes": [ required, string ]
			},
			"status": {
				"constraints": {
					"oneOf": {
						"values": [ "will_start", "ongoing", "done" ]
					}
				},
				"pipes": [ required, oneOf ]
			}
			// TODO Dates
		}

		return makeResourceDocumentRules("consultation", attributes)
	}

	get manager(): BaseManagerClass { return ConsultationManager }

	async handle(request: Request, unusedResponse: Response): Promise<NoContentResponseInfo> {
		const manager = new ConsultationManager(request.transaction, request.cache)
		const { id } = request.params
		await manager.update(Number(id), request.body.data.attributes)

		return new NoContentResponseInfo()
	}
}
