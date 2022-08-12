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

export interface ProfilePictureResourceIdentifier<T extends string|number = string>
extends ResourceIdentifier<T> {
	type: "profile_picture",
}

export type ProfilePictureAttributes<T = string> = FileLikeAttributes<T>

export interface ProfilePictureResource<T = string> extends Resource<
	ProfilePictureResourceIdentifier,
	ProfilePictureAttributes<T>
>, FileLikeResourceLinks {}

export type DeserializedProfilePictureResource<T extends string|number = string>
= DeserializedResource<
	T,
	ProfilePictureResourceIdentifier<T>,
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

export type DeserializedProfilePictureDocument<T extends string|number = string>
= DeserializedResourceDocument<
	T,
	ProfilePictureResourceIdentifier<T>,
	ProfilePictureAttributes,
	DeserializedProfilePictureResource<T>
>

export type DeserializedProfilePictureListDocument<T extends string|number = string>
= DeserializedResourceListDocument<
	T,
	ProfilePictureResourceIdentifier<T>,
	ProfilePictureAttributes,
	DeserializedProfilePictureResource<T>
>
