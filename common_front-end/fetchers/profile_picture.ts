import type { Serializable } from "$/types/general"
import type { Response } from "$@/types/independent"
import type { CommonQueryParameters } from "$/types/query"
import type {
	ProfilePictureResourceIdentifier,
	ProfilePictureAttributes,
	ProfilePictureResource,
	DeserializedProfilePictureResource,
	ProfilePictureDocument,
	ProfilePictureListDocument,
	DeserializedProfilePictureDocument,
	DeserializedProfilePictureListDocument
} from "$/types/documents/profile_picture"
import { MULTIPART_MEDIA_TYPE } from "$/types/server"

import Fetcher from "$@/fetchers/fetcher"
import specializedPath from "$/helpers/specialize_path"

export default class ProfilePictureFetcher extends Fetcher<
	ProfilePictureResourceIdentifier,
	ProfilePictureAttributes,
	ProfilePictureResource,
	DeserializedProfilePictureResource,
	ProfilePictureDocument<string>,
	ProfilePictureListDocument,
	DeserializedProfilePictureDocument,
	DeserializedProfilePictureListDocument,
	Serializable,
	CommonQueryParameters
> {
	static initialize(basePath: string) {
		super.initialize(basePath, "profile_picture")
	}

	constructor() {
		super(ProfilePictureFetcher.basePath, ProfilePictureFetcher.type)
	}

	async createFile(userID: number, details: FormData): Promise<Response<
		ProfilePictureResourceIdentifier,
		ProfilePictureAttributes,
		ProfilePictureResource,
		DeserializedProfilePictureResource,
		DeserializedProfilePictureDocument
	>> {
		const pathTemplate = "user/:id/relationships/:type"
		const path = specializedPath(pathTemplate, { id: userID, type: this.type })
		const headers = this.makeJSONHeaders(MULTIPART_MEDIA_TYPE)

		return await this.handleResponse(
			this.postTo(path, details, headers)
		) as Response<
			ProfilePictureResourceIdentifier,
			ProfilePictureAttributes,
			ProfilePictureResource,
			DeserializedProfilePictureResource,
			DeserializedProfilePictureDocument
		>
	}

	async updateFile(profilePictureID: number, details: FormData): Promise<Response<
		ProfilePictureResourceIdentifier,
		ProfilePictureAttributes,
		ProfilePictureResource,
		DeserializedProfilePictureResource,
		DeserializedProfilePictureDocument
	>> {
		const pathTemplate = ":type/:id"
		const path = specializedPath(pathTemplate, { id: profilePictureID, type: this.type })
		const headers = this.makeJSONHeaders(MULTIPART_MEDIA_TYPE)

		return await this.handleResponse(
			this.patchThrough(path, details, headers)
		) as Response<
			ProfilePictureResourceIdentifier,
			ProfilePictureAttributes,
			ProfilePictureResource,
			DeserializedProfilePictureResource,
			DeserializedProfilePictureDocument
		>
	}
}
