import type { Rules, FieldRules } from "!/types/validation"
import type { ChatMessageActivityDocument } from "$/types/documents/chat_message_activity"
import type { AuthenticatedIDRequest, Response, BaseManagerClass } from "!/types/dependent"

import Socket from "!/ws/socket"
import Policy from "!/bases/policy"
import Manager from "%/managers/chat_message_activity"
import Merger from "!/middlewares/miscellaneous/merger"
import NoContentResponseInfo from "!/response_infos/no_content"
import DoubleBoundJSONController from "!/controllers/double_bound_json"
import makeConsultationChatActivityNamespace from "$/namespace_makers/consultation_chat_activity"

import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import BelongsToCurrentUserPolicy from "!/policies/belongs_to_current_user"

import date from "!/validators/base/date"
import string from "!/validators/base/string"
import required from "!/validators/base/required"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"

export default class extends DoubleBoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new Merger([
			CommonMiddlewareList.consultationParticipantsOnlyPolicy,
			new BelongsToCurrentUserPolicy(this.manager)
		]) as unknown as Policy
	}

	makeBodyRuleGenerator(unusedRequest: AuthenticatedIDRequest): FieldRules {
		const pureDate: Rules = {
			"pipes": [ required, string, date ]
		}

		const attributes: FieldRules = {
			"receivedMessageAt": pureDate,
			"seenMessageAt": pureDate
		}

		return makeResourceDocumentRules(
			"chat_message_activity",
			attributes,
			{
				"isNew": false,
				"mustCastID": false
			}
		)
	}

	get manager(): BaseManagerClass { return Manager }

	async handle(request: AuthenticatedIDRequest, unusedResponse: Response)
	: Promise<NoContentResponseInfo> {
		const manager = new Manager(request)
		const id = Number(request.params.id)
		const oldDocument = await manager.findWithID(id) as ChatMessageActivityDocument
		const updatedDocument = request.body as ChatMessageActivityDocument

		await manager.update(id, updatedDocument.data.attributes)

		Socket.emitToClients(
			makeConsultationChatActivityNamespace(String(
				oldDocument.data.relationships.consultation.data.id
			)),
			"update",
			updatedDocument
		)

		return new NoContentResponseInfo()
	}
}
