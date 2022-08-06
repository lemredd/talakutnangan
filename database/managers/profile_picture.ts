import type { ModelCtor } from "%/types/dependent"
import type { GeneralObject } from "$/types/general"
import type { RawProfilePicture } from "$!/types/independent"
import type { ProfilePictureTransformerOptions } from "%/types/independent"

import BaseManager from "%/managers/base"
import ProfilePicture from "%/models/profile_picture"
import ProfilePictureTransformer from "%/transformers/profile_picture"

export default class extends BaseManager<
	ProfilePicture,
	RawProfilePicture,
	GeneralObject,
	ProfilePictureTransformerOptions
> {
	get model(): ModelCtor<ProfilePicture> { return ProfilePicture }

	get transformer(): ProfilePictureTransformer { return new ProfilePictureTransformer() }
}
