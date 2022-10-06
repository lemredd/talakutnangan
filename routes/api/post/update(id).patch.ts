import type { Rules, FieldRules } from "!/types/validation"
import type { AuthenticatedRequest, Response, BaseManagerClass } from "!/types/dependent"

import Policy from "!/bases/policy"
import PostManager from "%/managers/post"
import Merger from "!/middlewares/miscellaneous/merger"
import NoContentResponseInfo from "!/response_infos/no_content"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import DoubleBoundJSONController from "!/controllers/double_bound_json"

import string from "!/validators/base/string"
import same from "!/validators/comparison/same"
import required from "!/validators/base/required"
import nullable from "!/validators/base/nullable"
import length from "!/validators/comparison/length"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"
import BelongsToCurrentUserPolicy from "!/policies/belongs_to_current_user"

export default class extends DoubleBoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new Merger([
			CommonMiddlewareList.studentOnlyPolicy,
			new BelongsToCurrentUserPolicy(this.manager)
		]) as unknown as Policy
	}

	makeBodyRuleGenerator(unusedAuthenticatedRequest: AuthenticatedRequest): FieldRules {
		const pureNull: Rules = {
			"constraints": {
				"nullable": {
					"defaultValue": null
				},
				"same": {
					"value": null
				}
			},
			"pipes": [ nullable, same ]
		}

		const attributes = {
			"approvedAt": pureNull,
			"content": {
				"constraints": {
					"length": {
						"maximum": 1000,
						"minimum": 5
					}
				},
				"pipes": [ required, string, length ]
			}
		}


		return makeResourceDocumentRules("post", attributes)
	}

	get manager(): BaseManagerClass { return PostManager }

	async handle(request: AuthenticatedRequest, unusedResponse: Response)
	: Promise<NoContentResponseInfo> {
		const manager = new PostManager(request)
		const { id } = request.params
		await manager.update(Number(id), request.body.data.attributes)

		return new NoContentResponseInfo()
	}
}
