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

export interface AttachedChatFileResourceIdentifier<T extends Completeness = "read">
extends ResourceIdentifier<T> {
	type: "attached_chat_file"
}

export type AttachedChatFileAttributes<T extends Format = "serialized"> = FileLikeAttributes<T>

export type AttachedChatFileResource<
	T extends Completeness = "read",
	U extends Format = "serialized"
> = Resource<
	T,
	AttachedChatFileResourceIdentifier<T>,
	AttachedChatFileAttributes<U>
>

export type DeserializedAttachedChatFileResource<T extends Format = "serialized">
= DeserializedResource<
	AttachedChatFileResourceIdentifier<"read">,
	AttachedChatFileAttributes<T>
>

export type AttachedChatFileDocument<
	T extends Completeness = "read",
	U extends Format = "serialized"
> = ResourceDocument<
	T,
	AttachedChatFileResourceIdentifier<T>,
	AttachedChatFileAttributes<U>,
	AttachedChatFileResource<T, U>
>

export type AttachedChatFileListDocument<
	T extends Completeness = "read",
	U extends Format = "serialized"
> = ResourceListDocument<
	T,
	AttachedChatFileResourceIdentifier<T>,
	AttachedChatFileAttributes<U>,
	AttachedChatFileResource<T, U>
>

export type DeserializedAttachedChatFileDocument<T extends Format = "serialized">
= DeserializedResourceDocument<
	AttachedChatFileResourceIdentifier<"read">,
	AttachedChatFileAttributes<T>,
	DeserializedAttachedChatFileResource<T>
>

export type DeserializedAttachedChatFileListDocument<T extends Format = "serialized">
= DeserializedResourceListDocument<
	AttachedChatFileResourceIdentifier<"read">,
	AttachedChatFileAttributes<T>,
	DeserializedAttachedChatFileResource<T>
>

export type AttachedChatFileIdentifierDocument
= IdentifierDocument<AttachedChatFileResourceIdentifier<"read">>

export type AttachedChatFileIdentifierListDocument
= IdentifierListDocument<AttachedChatFileResourceIdentifier<"read">>
