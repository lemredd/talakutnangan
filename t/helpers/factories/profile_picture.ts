import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type { ProfilePictureTransformerOptions } from "%/types/independent"
import type {
	ProfilePictureResource,
	ProfilePictureDocument,
	ProfilePictureAttributes,
	ProfilePictureListDocument,
	ProfilePictureResourceIdentifier,
	DeserializedProfilePictureResource,
	DeserializedProfilePictureDocument,
	DeserializedProfilePictureListDocument
} from "$/types/documents/profile_picture"

import User from "%/models/user"
import UserFactory from "~/factories/user"
import FileLikeFactory from "~/factories/file-like"
import ProfilePicture from "%/models/profile_picture"
import ProfilePictureTransformer from "%/transformers/profile_picture"

export default class ProfilePictureFactory extends FileLikeFactory<
	ProfilePicture,
	ProfilePictureResourceIdentifier,
	ProfilePictureAttributes,
	ProfilePictureResource,
	DeserializedProfilePictureResource,
	ProfilePictureDocument<string>,
	ProfilePictureListDocument,
	DeserializedProfilePictureDocument,
	DeserializedProfilePictureListDocument,
	ProfilePictureTransformerOptions
> {
	#user: () => Promise<User>  =  () => new UserFactory().insertOne()

	get model(): ModelCtor<ProfilePicture> { return ProfilePicture }

	get transformer(): ProfilePictureTransformer { return new ProfilePictureTransformer() }

	async generate(): GeneratedData<ProfilePicture> {
		return {
			userID: (await this.#user()).id,
			fileContents: this.fileContentsGenerator()
		}
	}

	user(generator: () => Promise<User>): ProfilePictureFactory {
		this.#user = generator
		return this
	}
}
