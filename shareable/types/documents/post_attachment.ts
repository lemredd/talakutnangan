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

export interface PostAttachmentResourceIdentifier<T extends Completeness = "read">
extends ResourceIdentifier<T> {
	type: "post_attachment"
}

export interface PostAttachmentAttributes<T extends Format = "serialized">
extends FileLikeAttributes<T> {
	"fileType": string
}

export type PostAttachmentResource<
	T extends Completeness = "read",
	U extends Format = "serialized"
> = Resource<
	T,
	PostAttachmentResourceIdentifier<T>,
	PostAttachmentAttributes<U>
>

export type DeserializedPostAttachmentResource<T extends Format = "serialized">
= DeserializedResource<
	PostAttachmentResourceIdentifier<"read">,
	PostAttachmentAttributes<T>
>

export type PostAttachmentDocument<
	T extends Completeness = "read",
	U extends Format = "serialized"
> = ResourceDocument<
	T,
	PostAttachmentResourceIdentifier<T>,
	PostAttachmentAttributes<U>,
	PostAttachmentResource<T, U>
>

export type PostAttachmentListDocument<
	T extends Completeness = "read",
	U extends Format = "serialized"
> = ResourceListDocument<
	T,
	PostAttachmentResourceIdentifier<T>,
	PostAttachmentAttributes<U>,
	PostAttachmentResource<T, U>
>

export type DeserializedPostAttachmentDocument<T extends Format = "serialized">
= DeserializedResourceDocument<
	PostAttachmentResourceIdentifier<"read">,
	PostAttachmentAttributes<T>,
	DeserializedPostAttachmentResource<T>
>

export type DeserializedPostAttachmentListDocument<T extends Format = "serialized">
= DeserializedResourceListDocument<
	PostAttachmentResourceIdentifier<"read">,
	PostAttachmentAttributes<T>,
	DeserializedPostAttachmentResource<T>
>

export type PostAttachmentIdentifierDocument
= IdentifierDocument<PostAttachmentResourceIdentifier<"read">>

export type PostAttachmentIdentifierListDocument
= IdentifierListDocument<PostAttachmentResourceIdentifier<"read">>
