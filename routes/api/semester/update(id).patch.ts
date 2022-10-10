import type { FieldRules } from "!/types/validation"
import type { AuthenticatedRequest, Response, BaseManagerClass } from "!/types/dependent"

import Policy from "!/bases/policy"
import { OrderValues } from "$/types/database"
import SemesterManager from "%/managers/semester"
import Merger from "!/middlewares/miscellaneous/merger"
import NoContentResponseInfo from "!/response_infos/no_content"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import BoundJSONController from "!/controllers/bound_json"

import date from "!/validators/base/date"
import string from "!/validators/base/string"
import required from "!/validators/base/required"
import oneOf from "!/validators/comparison/one-of"
import length from "!/validators/comparison/length"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"
import BelongsToCurrentUserPolicy from "!/policies/belongs_to_current_user"

export default class extends BoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new Merger([
			CommonMiddlewareList.studentOnlyPolicy,
			new BelongsToCurrentUserPolicy(this.manager)
		]) as unknown as Policy
	}

	makeBodyRuleGenerator(unusedAuthenticatedRequest: AuthenticatedRequest): FieldRules {
		const attributes = {
			"name": {
				"constraints": {
					"length": {
						"maximum": 255,
						"minimum": 10
					}
				},
				"pipes": [ required, string, length ]
			},
			"semesterOrder": {
				"constraints": {
					"oneOf": {
						"values": [ ...OrderValues ]
					}
				},
				"pipes": [ required, string, oneOf ]
			},
			"startAt": {
				"pipes": [ required, string, date ]
			},
			"endAt": {
				"pipes": [ required, string, date ]
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
