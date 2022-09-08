import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type { FileLikeTransformerOptions } from "%/types/independent"
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
	ProfilePictureResourceIdentifier<"read">,
	ProfilePictureAttributes<"raw">,
	ProfilePictureAttributes<"raw">,
	ProfilePictureResource<"read", "raw">,
	DeserializedProfilePictureResource<"raw">,
	ProfilePictureDocument<"read", "raw">,
	ProfilePictureListDocument<"read", "raw">,
	DeserializedProfilePictureDocument<"raw">,
	DeserializedProfilePictureListDocument<"raw">,
	FileLikeTransformerOptions
> {
	#user: () => Promise<User> = async() => await new UserFactory().insertOne()

	get model(): ModelCtor<ProfilePicture> { return ProfilePicture }

	get transformer(): ProfilePictureTransformer { return new ProfilePictureTransformer() }

	async generate(): GeneratedData<ProfilePicture> {
		return {
			"fileContents": this.fileContentsGenerator(),
			"userID": (await this.#user()).id
		}
	}

	user(generator: () => Promise<User>): ProfilePictureFactory {
		this.#user = generator
		return this
	}
}
