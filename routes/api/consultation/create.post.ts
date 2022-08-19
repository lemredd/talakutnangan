import type { FieldRules, Rules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import RoleManager from "%/managers/role"
import JSONController from "!/controllers/json"
import ConsultationManager from "%/managers/consultation"
import CreatedResponseInfo from "!/response_infos/created"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

import object from "!/validators/base/object"
import string from "!/validators/base/string"
import exists from "!/validators/manager/exists"
import required from "!/validators/base/required"
import oneOf from "!/validators/comparison/one-of"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"
import makeResourceIdentifierRules from "!/rule_sets/make_resource_identifier"
import makeResourceIdentifierListDocumentRules
	from "!/rule_sets/make_resource_identifier_list_document"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return CommonMiddlewareList.studentOnlyPolicy
	}

	makeBodyRuleGenerator(unusedRequest: Request): FieldRules {
		/**
		 * TODO: Validate reason with regex.
		 * TODO: Validate action taken with regex.
		 */
		const attributes = {
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
			},
			"actionTaken": {
				"constraints": { },
				"pipes": [ required, string ]
			}
		}

		const relationships: Rules = {
			"constraints": {
				"object": {
					"consultant": {
						"constraints": {
							"object": {
								"data": {
									"constraints": {
										"object": makeResourceIdentifierRules("user", exists, UserManager)
									},
									"pipes": [ required, object ]
								}
							}
						},
						"pipes": [ required, object ]
					},
					"consultantRole": {
						"constraints": {
							"object": {
								"data": {
									"constraints": {
										"object": makeResourceIdentifierRules("role", exists, RoleManager)
									},
									"pipes": [ required, object ]
								}
							}
						},
						"pipes": [ required, object ]
					},
					"consulters": {
						"constraints": {
							"object": makeResourceIdentifierListDocumentRules("user", exists, UserManager)
						},
						"pipes": [ required, object ]
					}
				}
			},
			"pipes": [ required, object ]
		}

		return makeResourceDocumentRules(
			"consultation",
			attributes,
			{
				"isNew": true,
				"mustCastID": true,
				"extraDataQueries": { relationships }
			}
		)
	}

	async handle(request: Request, unusedResponse: Response): Promise<CreatedResponseInfo> {
		const manager = new ConsultationManager(request.transaction, request.cache)

		// TODO: Get the attached role ID first
		const consultationInfo = await manager.create(request.body.data.attributes)

		return new CreatedResponseInfo(consultationInfo)
	}
}
