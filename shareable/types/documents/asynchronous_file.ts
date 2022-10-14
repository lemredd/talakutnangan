import type { RawableFormat, FormatRegulator } from "$/types/documents/irregularity"
import type {
	AsynchronousLikeRelationshipData,
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

	PartialOrPickDeserializedRelationship,

	ResourceDocument,
	ResourceListDocument,
	DeserializedResourceDocument,
	DeserializedResourceListDocument,

	IdentifierDocument,
	IdentifierListDocument
} from "$/types/documents/base"

type AsynchronousFileRelationshipData<T extends Completeness> = AsynchronousLikeRelationshipData<T>

export type AsynchronousFileRelationshipNames = AsynchronousLikeRelationshipNames

export type AsynchronousFileRelationships<T extends Completeness = "read">
= AsynchronousLikeRelationships<T>

export type DeserializedAsynchronousFileRelationships<T extends Completeness = "read">
= DeserializedAsynchronousLikeRelationships<T>

export interface AsynchronousFileResourceIdentifier<T extends Completeness = "read">
extends ResourceIdentifier<T> {
	type: "asynchronous_file"
}

export interface AsynchronousFileAttributes<T extends RawableFormat = "serialized">
extends AsynchronousLikeAttributes<FormatRegulator<T>> {
	fileContents: (T extends "raw" ? Buffer : string)|null
}

export type AsynchronousFileResource<T extends Completeness = "read"> = Resource<
	T,
	AsynchronousFileResourceIdentifier<T>,
	AsynchronousFileAttributes<"serialized">
> & AsynchronousFileRelationships

export type DeserializedAsynchronousFileResource<
	T extends AsynchronousFileRelationshipNames|undefined = undefined
> = DeserializedResource<
	AsynchronousFileResourceIdentifier<"read">,
	AsynchronousFileAttributes<"deserialized">
> & PartialOrPickDeserializedRelationship<
	AsynchronousFileRelationshipData<"read">,
	DeserializedAsynchronousFileRelationships<"read">,
	AsynchronousFileRelationshipNames,
	T extends AsynchronousFileRelationshipNames ? true : false,
	T extends AsynchronousFileRelationshipNames ? T : AsynchronousFileRelationshipNames
>

export type AsynchronousFileDocument<T extends Completeness = "read"> = ResourceDocument<
	T,
	AsynchronousFileResourceIdentifier<T>,
	AsynchronousFileAttributes<"serialized">,
	AsynchronousFileResource<T>
>

export type AsynchronousFileListDocument<T extends Completeness = "read"> = ResourceListDocument<
	T,
	AsynchronousFileResourceIdentifier<T>,
	AsynchronousFileAttributes<"serialized">,
	AsynchronousFileResource<T>
>

export type DeserializedAsynchronousFileDocument<
	T extends AsynchronousFileRelationshipNames|undefined = undefined
> = DeserializedResourceDocument<
	AsynchronousFileResourceIdentifier<"read">,
	AsynchronousFileAttributes<"deserialized">,
	DeserializedAsynchronousFileResource<T>
>

export type DeserializedAsynchronousFileListDocument<
	T extends AsynchronousFileRelationshipNames|undefined = undefined
> = DeserializedResourceListDocument<
	AsynchronousFileResourceIdentifier<"read">,
	AsynchronousFileAttributes<"deserialized">,
	DeserializedAsynchronousFileResource<T>
>

export type AsynchronousFileIdentifierDocument
= IdentifierDocument<AsynchronousFileResourceIdentifier<"read">>

export type AsynchronousFileIdentifierListDocument
= IdentifierListDocument<AsynchronousFileResourceIdentifier<"read">>
