import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type { ProfilePictureTransformerOptions } from "%/types/independent"
import type {
	ProfilePictureResourceIdentifier,
	ProfilePictureAttributes,
	DeserializedProfilePictureResource,
	DeserializedProfilePictureDocument,
	DeserializedProfilePictureListDocument
} from "$/types/documents/profile_picture"

import dataURIToBuffer from "data-uri-to-buffer"
import type { MimeBuffer } from "data-uri-to-buffer"
import { faker } from "@faker-js/faker"

import User from "%/models/user"
import UserFactory from "~/factories/user"
import BaseFactory from "~/factories/base"
import ProfilePicture from "%/models/profile_picture"
import ProfilePictureTransformer from "%/transformers/profile_picture"

export default class ProfilePictureFactory extends BaseFactory<
	ProfilePicture,
	ProfilePictureResourceIdentifier,
	ProfilePictureAttributes,
	DeserializedProfilePictureResource,
	DeserializedProfilePictureDocument,
	DeserializedProfilePictureListDocument,
	ProfilePictureTransformerOptions
> {
	#user: () => Promise<User>  =  () => new UserFactory().insertOne()
	#profile_picture: () => MimeBuffer = () => dataURIToBuffer(faker.image.dataUri())

	get model(): ModelCtor<ProfilePicture> { return ProfilePicture }

	get transformer(): ProfilePictureTransformer { return new ProfilePictureTransformer() }

	async generate(): GeneratedData<ProfilePicture> {
		return {
			userID: (await this.#user()).id,
			file: this.#profile_picture()
		}
	}

	profile_picture(generator: () => MimeBuffer): ProfilePictureFactory {
		this.#profile_picture = generator
		return this
	}

	user(generator: () => Promise<User>): ProfilePictureFactory {
		this.#user = generator
		return this
	}
}
