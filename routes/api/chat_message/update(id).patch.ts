import type { Request, Response } from "!/types/dependent"
import type { FieldRules, Rules } from "!/types/validation"
import type { BaseManagerClass } from "!/types/independent"

import UserManager from "%/managers/user"
import ChatMessageManager from "%/managers/chat_message"
import ConsultationManager from "%/managers/consultation"
import NoContentResponseInfo from "!/response_infos/no_content"
import DoubleBoundJSONController from "!/controllers/double_bound_json"

import Policy from "!/bases/policy"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

import object from "!/validators/base/object"
import exists from "!/validators/manager/exists"
import required from "!/validators/base/required"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"
import makeResourceIdentifierRules from "!/rule_sets/make_resource_identifier"

export default class extends DoubleBoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return CommonMiddlewareList.consultationParticipantsOnlyPolicy
	}

	makeBodyRuleGenerator(unusedRequest: Request): FieldRules {
		const attributes: FieldRules = {
			"data": {
				"constraints": {
					"object": {}
				},
				"pipes": [ object ]
			}
		}

		const relationships: Rules = {
			"constraints": {
				"object": {
					"consultation": {
						"constraints": {
							"object": {
								"data": {
									"constraints": {
										"object": makeResourceIdentifierRules(
											"consultation",
											exists,
											ConsultationManager
										)
									},
									"pipes": [ required, object ]
								}
							}
						},
						"pipes": [ required, object ]
					},
					"user": {
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
					}
				}
			},
			"pipes": [ required, object ]
		}

		return makeResourceDocumentRules("chat_message", attributes, {
			"extraDataQueries": { relationships }
		})
	}

	get manager(): BaseManagerClass { return ChatMessageManager }

	async handle(request: Request, unusedResponse: Response): Promise<NoContentResponseInfo> {
		const manager = new ChatMessageManager(request.transaction, request.cache)
		const { id } = request.params
		await manager.update(Number(id), request.body.data.attributes)

		return new NoContentResponseInfo()
	}
}
