import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { BaseManagerClass } from "!/types/independent"
import type { ChatMessageDocument } from "$/types/documents/chat_message"

import Socket from "!/ws/socket"
import Log from "$!/singletons/log"
import JSONController from "!/controllers/json"
import ChatMessageManager from "%/managers/chat_message"
import CreatedResponseInfo from "!/response_infos/created"
import ChatMessageActivityManager from "%/managers/chat_message_activity"
import makeConsultationChatNamespace from "$/namespace_makers/consultation_chat"

import Policy from "!/bases/policy"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

import exists from "!/validators/manager/exists"
import anyObject from "!/validators/base/any_object"
import makeRelationshipRules from "!/rule_sets/make_relationships"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"

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

		const relationships: FieldRules = makeRelationshipRules([
			{
				"ClassName": ChatMessageActivityManager,
				"isArray": false,
				"relationshipName": "chatMessageActivity",
				"typeName": "chat_message_activity",
				"validator": exists
			}
		])

		return makeResourceDocumentRules("chat_message", attributes, {
			"extraDataQueries": relationships,
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
			"chatMessageActivityID": Number(relationships.chatMessageActivity.data.id)
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
