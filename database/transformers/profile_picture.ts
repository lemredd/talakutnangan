import type { ProfilePictureTransformerOptions } from "%/types/independent"
import ProfilePicture from "%/models/profile_picture"
import FileLikeTransformer from "%/transformers/file-like"

export default class extends FileLikeTransformer<ProfilePicture, ProfilePictureTransformerOptions> {
	constructor() {
		super("profile_picture")
	}
}
