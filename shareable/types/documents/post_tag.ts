/**
 * @description This module should not be used in production code. It only for testing purposes.
 */
import type { DeserializedPostDocument, PostIdentifierDocument } from "$/types/documents/post"
import type { DeserializedTagDocument, TagIdentifierDocument } from "$/types/documents/tag"
import type {
	Completeness,
	Format,

	Resource,
	Attributes,
	ResourceDocument,
	ResourceIdentifier,

	DeriveRelationships,
	DeriveRelationshipNames,
	GeneralRelationshipData,
	DeriveDeserializedRelationships,
	PartialOrPickDeserializedRelationship,

	DeserializedResource,
	ResourceListDocument,
	DeserializedResourceDocument,
	DeserializedResourceListDocument
} from "$/types/documents/base"

export interface PostTagResourceIdentifier<T extends Completeness = "read">
extends ResourceIdentifier<T> {
	type: "post_Tag"
}

export type PostTagAttributes<T extends Format = "serialized"> = Attributes<T>

interface PostTagRelationshipData<unusedT extends Completeness = "read">
extends GeneralRelationshipData {
	tag: {
		serialized: TagIdentifierDocument,
		deserialized: DeserializedTagDocument,
	},
	post: {
		serialized: PostIdentifierDocument,
		deserialized: DeserializedPostDocument
	}
}

export type PostTagRelationshipNames
= DeriveRelationshipNames<PostTagRelationshipData>

export type PostTagRelationships<T extends Completeness = "read">
= DeriveRelationships<PostTagRelationshipData<T>>

export type DeserializedPostTagRelationships<T extends Completeness = "read">
= DeriveDeserializedRelationships<PostTagRelationshipData<T>>

export type PostTagResource<T extends Completeness = "read"> = Resource<
	T,
	PostTagResourceIdentifier<T>,
	PostTagAttributes<"serialized">
>

export type DeserializedPostTagResource<
T extends PostTagRelationshipNames|undefined = undefined
> = DeserializedResource<
	PostTagResourceIdentifier<"read">,
	PostTagAttributes<"deserialized">
> & PartialOrPickDeserializedRelationship<
	PostTagRelationshipData<"read">,
	DeserializedPostTagRelationships<"read">,
	PostTagRelationshipNames,
	T extends PostTagRelationshipNames ? true : false,
	T extends PostTagRelationshipNames ? T : PostTagRelationshipNames
>

export type PostTagDocument<T extends Completeness = "read"> = ResourceDocument<
	T,
	PostTagResourceIdentifier<T>,
	PostTagAttributes<"serialized">,
	PostTagResource<T>
>

export type PostTagListDocument<T extends Completeness = "read"> = ResourceListDocument<
	T,
	PostTagResourceIdentifier<T>,
	PostTagAttributes<"serialized">,
	PostTagResource<T>
>

export type DeserializedPostTagDocument<
	T extends PostTagRelationshipNames|undefined = undefined
> = DeserializedResourceDocument<
	PostTagResourceIdentifier<"read">,
	PostTagAttributes<"deserialized">,
	DeserializedPostTagResource<T>
>

export type DeserializedPostTagListDocument<
	T extends PostTagRelationshipNames|undefined = undefined
> = DeserializedResourceListDocument<
	PostTagResourceIdentifier<"read">,
	PostTagAttributes<"deserialized">,
	DeserializedPostTagResource<T>
>
