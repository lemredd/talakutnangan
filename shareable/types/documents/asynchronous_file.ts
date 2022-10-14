import type { RawableFormat as Format, FormatRegulator } from "$/types/documents/irregularity"
import type {
	AsynchronousLikeRelationshipNames,
	AsynchronousLikeRelationships,
	DeserializedAsynchronousLikeRelationships,
	AsynchronousLikeAttributes
} from "$/types/documents/asynchronous-like"
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

export type AsynchronousFileRelationshipNames = AsynchronousLikeRelationshipNames

export type AsynchronousFileRelationships<T extends Completeness = "read">
= AsynchronousLikeRelationships<T>

export type DeserializedAsynchronousFileRelationships<T extends Completeness = "read">
= DeserializedAsynchronousLikeRelationships<T>

export interface AsynchronousFileResourceIdentifier<T extends Completeness = "read">
extends ResourceIdentifier<T> {
	type: "asynchronous_file"
}

export interface AsynchronousFileAttributes<T extends Format = "serialized">
extends AsynchronousLikeAttributes<FormatRegulator<T>> {
	fileContents: (T extends "raw" ? Buffer : string)|null
}

export type AsynchronousFileResource<
	T extends Completeness = "read",
	U extends Format = "serialized"
> = Resource<
	T,
	AsynchronousFileResourceIdentifier<T>,
	AsynchronousFileAttributes<U>
>

export type DeserializedAsynchronousFileResource<T extends Format = "serialized">
= DeserializedResource<
	AsynchronousFileResourceIdentifier<"read">,
	AsynchronousFileAttributes<T>
>

export type AsynchronousFileDocument<
	T extends Completeness = "read",
	U extends Format = "serialized"
> = ResourceDocument<
	T,
	AsynchronousFileResourceIdentifier<T>,
	AsynchronousFileAttributes<U>,
	AsynchronousFileResource<T, U>
>

export type AsynchronousFileListDocument<
	T extends Completeness = "read",
	U extends Format = "serialized"
> = ResourceListDocument<
	T,
	AsynchronousFileResourceIdentifier<T>,
	AsynchronousFileAttributes<U>,
	AsynchronousFileResource<T, U>
>

export type DeserializedAsynchronousFileDocument<T extends Format = "serialized">
= DeserializedResourceDocument<
	AsynchronousFileResourceIdentifier<"read">,
	AsynchronousFileAttributes<T>,
	DeserializedAsynchronousFileResource<T>
>

export type DeserializedAsynchronousFileListDocument<T extends Format = "serialized">
= DeserializedResourceListDocument<
	AsynchronousFileResourceIdentifier<"read">,
	AsynchronousFileAttributes<T>,
	DeserializedAsynchronousFileResource<T>
>

export type AsynchronousFileIdentifierDocument
= IdentifierDocument<AsynchronousFileResourceIdentifier<"read">>

export type AsynchronousFileIdentifierListDocument
= IdentifierListDocument<AsynchronousFileResourceIdentifier<"read">>
