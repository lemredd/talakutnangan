import type { IncludedRelationships } from "%/types/independent"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import Transformer from "%/transformers/base"
import Consultation from "%/models/consultation"
import UserTransformer from "%/transformers/user"
import RoleTransformer from "%/transformers/role"
import Serializer from "%/transformers/serializer"
import ChatMessageActivityTransformer from "%/transformers/chat_message_activity"

type Relationships = "consultant"|"consultantRole"|"consulters"|"chatMessageActivities"

export default class extends Transformer<Consultation, void> {
	constructor(
		{ included }: IncludedRelationships<Relationships> = {
			"included": [ "consultant", "consultantRole", "consulters" ]
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
			included.indexOf("consulters") > -1
				? {
					"attribute": "consulters",
					"transformer": new UserTransformer()
				}
				: null,
			included.indexOf("chatMessageActivities") > -1
				? {
					"attribute": "chatMessageActivities",
					"transformer": new ChatMessageActivityTransformer({ "included": [ "user" ] })
				}
				: null
		])
	}

	transform(model: Consultation|Consultation[], unusedOptions: TransformerOptions)
	: AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"reason",
			"status",
			"actionTaken",
			"scheduledStartDatetime",
			"endDatetime"
		])

		return safeObject
	}
}
