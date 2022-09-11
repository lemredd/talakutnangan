import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { BaseManagerClass } from "!/types/independent"
import type { ChatMessageDocument } from "$/types/documents/chat_message"

import Socket from "!/ws/socket"
import Log from "$!/singletons/log"
import Manager from "%/managers/chat_message"
import JSONController from "!/controllers/json"
import { chatMessageKind } from "!/constants/regex"
import CreatedResponseInfo from "!/response_infos/created"
import ChatMessageActivityManager from "%/managers/chat_message_activity"
import makeConsultationChatNamespace from "$/namespace_makers/consultation_chat"

import Policy from "!/bases/policy"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

import string from "!/validators/base/string"
import exists from "!/validators/manager/exists"
import regex from "!/validators/comparison/regex"
import required from "!/validators/base/required"
import anyObject from "!/validators/base/any_object"
import makeRelationshipRules from "!/rule_sets/make_relationships"
import doesBelongToUser from "!/validators/manager/does_belong_to_user"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"

export default class extends JSONController {
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

		const relationships: FieldRules = makeRelationshipRules([
			{
				"ClassName": ChatMessageActivityManager,
				"isArray": false,
				"options": {
					"postIDRules": {
						"pipes": [ doesBelongToUser ]
					}
				},
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

	get manager(): BaseManagerClass { return Manager }

	async handle(request: Request, unusedResponse: Response): Promise<CreatedResponseInfo> {
		const manager = new Manager(request.transaction, request.cache)
		const { data } = request.body as ChatMessageDocument<"create">
		const { attributes, relationships } = data
		const chatMessageActivityID = Number(relationships.chatMessageActivity.data.id)

		const document = await manager.create({
			...attributes,
			chatMessageActivityID
		}) as ChatMessageDocument<"create">

		Socket.emitToClients(
			makeConsultationChatNamespace(document.data.relationships.consultation.data.id),
			"create",
			document
		)

		Log.success("controller", "successfully created the chat message of the user")

		return new CreatedResponseInfo(document)
	}
}
