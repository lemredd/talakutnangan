import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { BaseManagerClass } from "!/types/independent"
import type { ChatMessageActivityDocument } from "$/types/documents/chat_message_activity"

import Socket from "!/ws/socket"
import Manager from "%/managers/chat_message"
import { chatMessageKind } from "!/constants/regex"
import NoContentResponseInfo from "!/response_infos/no_content"
import DoubleBoundJSONController from "!/controllers/double_bound_json"
import ChatMessageActivityManager from "%/managers/chat_message_activity"
import makeConsultationChatNamespace from "$/namespace_makers/consultation_chat"

import Policy from "!/bases/policy"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

import string from "!/validators/base/string"
import regex from "!/validators/comparison/regex"
import required from "!/validators/base/required"
import anyObject from "!/validators/base/any_object"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"

export default class extends DoubleBoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return CommonMiddlewareList.consultationParticipantsOnlyPolicy
	}

	makeBodyRuleGenerator(unusedRequest: Request): FieldRules {
		const attributes: FieldRules = {
			"data": {
				"pipes": [ required, anyObject ]
			},
			"kind": {
				"constraints": {
					"regex": {
						"match": chatMessageKind
					}
				},
				"pipes": [ required, string, regex ]
			}
		}


		return makeResourceDocumentRules("chat_message", attributes)
	}

	get manager(): BaseManagerClass { return Manager }

	async handle(request: Request, unusedResponse: Response): Promise<NoContentResponseInfo> {
		const manager = new Manager(request.transaction, request.cache)
		const { id } = request.params
		await manager.update(Number(id), request.body.data.attributes)

		const activityManager = new ChatMessageActivityManager(request.transaction, request.cache)

		const activity = await activityManager.findWithID(Number(id)) as ChatMessageActivityDocument

		Socket.emitToClients(
			makeConsultationChatNamespace(activity.data.relationships.consultation.data.id),
			"update",
			request.body
		)

		return new NoContentResponseInfo()
	}
}
