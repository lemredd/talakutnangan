import type { FileLikeAttributes, FileLikeResourceLinks } from "$/types/documents/file-like"
import type {
	Resource,
	ResourceIdentifier,
	DeserializedResource,
	ResourceDocument,
	ResourceListDocument,
	DeserializedResourceDocument,
	DeserializedResourceListDocument
} from "$/types/documents/base"

export interface ProfilePictureResourceIdentifier extends ResourceIdentifier {
	type: "profile_picture",
}

export type ProfilePictureAttributes<T = string> = FileLikeAttributes<T>

export interface ProfilePictureResource<T = string> extends Resource<
	ProfilePictureResourceIdentifier,
	ProfilePictureAttributes<T>
>, FileLikeResourceLinks {}

export type DeserializedProfilePictureResource = DeserializedResource<
	ProfilePictureResourceIdentifier,
	ProfilePictureAttributes
>

export type ProfilePictureDocument<T = Buffer> = ResourceDocument<
	ProfilePictureResourceIdentifier,
	ProfilePictureAttributes<T>,
	ProfilePictureResource<T>
>

export type ProfilePictureListDocument = ResourceListDocument<
	ProfilePictureResourceIdentifier,
	ProfilePictureAttributes,
	ProfilePictureResource
>

export type DeserializedProfilePictureDocument = DeserializedResourceDocument<
	ProfilePictureResourceIdentifier,
	ProfilePictureAttributes,
	DeserializedProfilePictureResource
>

export type DeserializedProfilePictureListDocument = DeserializedResourceListDocument<
	ProfilePictureResourceIdentifier,
	ProfilePictureAttributes,
	DeserializedProfilePictureResource
>
