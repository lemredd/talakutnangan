import type { IncludedRelationships, FileLikeTransformerOptions } from "%/types/independent"

import AttachedChatFile from "%/models/attached_chat_file"
import FileLikeTransformer from "%/transformers/file-like"
import ChatMessageTransformer from "%/transformers/chat_message"

type Relationships = "chatMessage"

export default class extends FileLikeTransformer<AttachedChatFile, FileLikeTransformerOptions> {
	constructor({ included }: IncludedRelationships<Relationships> = {
		"included": [ "chatMessage" ]
	}) {
		super("attached_chat_file", [
			included.indexOf("chatMessage") > -1
				? {
					"attribute": "chatMessage",
					"transformer": new ChatMessageTransformer({
						"included": []
					})
				}
				: null
		])
	}
}
