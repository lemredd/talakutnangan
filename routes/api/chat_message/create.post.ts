import type { Request, Response } from "!/types/dependent"
import type { FieldRules, Rules } from "!/types/validation"
import type { BaseManagerClass } from "!/types/independent"
import type { ChatMessageDocument } from "$/types/documents/chat_message"

import Socket from "!/ws/socket"
import Log from "$!/singletons/log"
import UserManager from "%/managers/user"
import JSONController from "!/controllers/json"
import ChatMessageManager from "%/managers/chat_message"
import ConsultationManager from "%/managers/consultation"
import CreatedResponseInfo from "!/response_infos/created"
import makeConsultationChatNamespace from "$/namespace_makers/consultation_chat"

import Policy from "!/bases/policy"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

import object from "!/validators/base/object"
import anyObject from "!/validators/base/any_object"
import exists from "!/validators/manager/exists"
import required from "!/validators/base/required"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"
import makeResourceIdentifierRules from "!/rule_sets/make_resource_identifier"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return CommonMiddlewareList.consultationParticipantsOnlyPolicy
	}

	makeBodyRuleGenerator(unusedRequest: Request): FieldRules {
		const attributes: FieldRules = {
			"data": {
				"pipes": [ anyObject ]
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
			"extraDataQueries": { relationships },
			"isNew": true
		})
	}

	get manager(): BaseManagerClass { return ChatMessageManager }

	async handle(request: Request, unusedResponse: Response): Promise<CreatedResponseInfo> {
		const manager = new ChatMessageManager(request.transaction, request.cache)
		const { data } = request.body as ChatMessageDocument<"create">
		const { attributes, relationships } = data

		const document = await manager.create({
			...attributes,
			"consultationID": Number(relationships.consultation.data.id),
			"userID": Number(relationships.user.data.id)
		})

		Socket.emitToClients(
			makeConsultationChatNamespace(relationships.consultation.data.id),
			"create",
			document
		)

		Log.success("controller", "successfully created the chat message of the user")

		return new CreatedResponseInfo(document)
	}
}
