import type { FileLikeTransformerOptions } from "%/types/independent"
import AttachedChatFile from "%/models/attached_chat_file"
import FileLikeTransformer from "%/transformers/file-like"

export default class extends FileLikeTransformer<AttachedChatFile, FileLikeTransformerOptions> {
	constructor() {
		super("attached_chat_file")
	}
}
