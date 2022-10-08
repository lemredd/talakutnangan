import type { FileLikeTransformerOptions } from "%/types/independent"

import Model from "%/models/post_attachment"
import FileLikeTransformer from "%/transformers/file-like"

export default class extends FileLikeTransformer<Model, FileLikeTransformerOptions> {
	constructor() {
		super("post_attachment")
	}

	protected get otherWhiteListedAttributes(): string[] {
		return [ "type" ]
	}
}
