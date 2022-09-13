import type { FileLikeAttributes } from "$/types/documents/file-like"
import type { RawableFormat as Format } from "$/types/documents/irregularity"
import type {
	Completeness,

	Resource,
	ResourceIdentifier,
	DeserializedResource,

	ResourceDocument,
	ResourceListDocument,
	DeserializedResourceDocument,
	DeserializedResourceListDocument,

	IdentifierDocument,
	IdentifierListDocument
} from "$/types/documents/base"

export interface ProfilePictureResourceIdentifier<T extends Completeness = "read">
extends ResourceIdentifier<T> {
	type: "profile_picture"
}

export type ProfilePictureAttributes<T extends Format = "serialized"> = FileLikeAttributes<T>

export type ProfilePictureResource<
	T extends Completeness = "read",
	U extends Format = "serialized"
> = Resource<
	T,
	ProfilePictureResourceIdentifier<T>,
	ProfilePictureAttributes<U>
>

export type DeserializedProfilePictureResource<T extends Format = "serialized">
= DeserializedResource<
	ProfilePictureResourceIdentifier<"read">,
	ProfilePictureAttributes<T>
>

export type ProfilePictureDocument<
	T extends Completeness = "read",
	U extends Format = "serialized"
> = ResourceDocument<
	T,
	ProfilePictureResourceIdentifier<T>,
	ProfilePictureAttributes<U>,
	ProfilePictureResource<T, U>
>

export type ProfilePictureListDocument<
	T extends Completeness = "read",
	U extends Format = "serialized"
> = ResourceListDocument<
	T,
	ProfilePictureResourceIdentifier<T>,
	ProfilePictureAttributes<U>,
	ProfilePictureResource<T, U>
>

export type DeserializedProfilePictureDocument<T extends Format = "serialized">
= DeserializedResourceDocument<
	ProfilePictureResourceIdentifier<"read">,
	ProfilePictureAttributes<T>,
	DeserializedProfilePictureResource<T>
>

export type DeserializedProfilePictureListDocument<T extends Format = "serialized">
= DeserializedResourceListDocument<
	ProfilePictureResourceIdentifier<"read">,
	ProfilePictureAttributes<T>,
	DeserializedProfilePictureResource<T>
>

export type ProfilePictureIdentifierDocument
= IdentifierDocument<ProfilePictureResourceIdentifier<"read">>

export type ProfilePictureIdentifierListDocument
= IdentifierListDocument<ProfilePictureResourceIdentifier<"read">>
