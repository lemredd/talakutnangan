import Transformer from "%/transformers/base"
import Serializer from "%/transformers/serializer"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"
import  Post from "%/models/post"

export default class extends Transformer<Post, void> {
	constructor() {
		super("post")
	}

	transform(model: Post|Post[], options: TransformerOptions): AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"title",
			"desc",
			"badWordExist",
			"userID",
			"roleID",
		])

		return safeObject
	}


}
