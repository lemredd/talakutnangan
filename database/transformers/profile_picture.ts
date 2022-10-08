import type { ProfilePictureTransformerOptions } from "%/types/independent"
import Model from "%/models/profile_picture"
import FileLikeTransformer from "%/transformers/file-like"

export default class extends FileLikeTransformer<Model, ProfilePictureTransformerOptions> {
	constructor() {
		super("profile_picture")
	}
}
