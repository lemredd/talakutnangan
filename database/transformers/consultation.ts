import type { IncludedRelationships } from "%/types/independent"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import Transformer from "%/transformers/base"
import Consultation from "%/models/consultation"
import UserTransformer from "%/transformers/user"
import RoleTransformer from "%/transformers/role"
import Serializer from "%/transformers/serializer"
import ChatMessageTransformer from "%/transformers/chat_message"
import ChatMessageActivityTransformer from "%/transformers/chat_message_activity"

type Relationships =
	|"consultant"
	|"consultantRole"
	|"chatMessageActivities"
	|"chatMessages"

export default class extends Transformer<Consultation, void> {
	constructor(
		{ included }: IncludedRelationships<Relationships> = {
			"included": [ "consultant", "consultantRole", "chatMessageActivities", "chatMessages" ]
		}
	) {
		super("consultation", [
			included.indexOf("consultant") > -1
				? {
					"attribute": "consultant",
					"transformer": new UserTransformer()
				}
				: null,
			included.indexOf("consultantRole") > -1
				? {
					"attribute": "consultantRole",
					"transformer": new RoleTransformer()
				}
				: null,
			included.indexOf("chatMessageActivities") > -1
				? {
					"attribute": "chatMessageActivities",
					"transformer": new ChatMessageActivityTransformer({ "included": [ "user" ] })
				}
				: null,
			included.indexOf("chatMessages") > -1
				? {
					"attribute": "chatMessages",
					"transformer": new ChatMessageTransformer({
						"included": [ "user" ]
					})
				}
				: null
		])
	}

	transform(model: Consultation|Consultation[], unusedOptions: TransformerOptions)
	: AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"reason",
			"actionTaken",
			"scheduledStartAt",
			"startedAt",
			"finishedAt",
			"deletedAt"
		])

		return safeObject
	}
}
