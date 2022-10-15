/**
 * @description This module should not be used in production code. It only for testing purposes.
 */
import type { DeserializedPostDocument, PostIdentifierDocument } from "$/types/documents/comment"
import type { DeserializedProfanityFilterDocument,
	ProfanityFilterIdentifierDocument } from "$/types/documents/profanity_filter"
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

export interface FoundCommentWordResourceIdentifier<T extends Completeness = "read">
extends ResourceIdentifier<T> {
	type: "found_comment_word"
}

export type FoundCommentWordAttributes<T extends Format = "serialized"> = Attributes<T>

interface FoundCommentWordRelationshipData<unusedT extends Completeness = "read">
extends GeneralRelationshipData {
	profanity_filter: {
		serialized: ProfanityFilterIdentifierDocument,
		deserialized: DeserializedProfanityFilterDocument,
	},
	comment: {
		serialized: PostIdentifierDocument,
		deserialized: DeserializedPostDocument
	}
}

export type FoundCommentWordRelationshipNames
= DeriveRelationshipNames<FoundCommentWordRelationshipData>

export type FoundCommentWordRelationships<T extends Completeness = "read">
= DeriveRelationships<FoundCommentWordRelationshipData<T>>

export type DeserializedFoundCommentWordRelationships<T extends Completeness = "read">
= DeriveDeserializedRelationships<FoundCommentWordRelationshipData<T>>

export type FoundCommentWordResource<T extends Completeness = "read"> = Resource<
	T,
	FoundCommentWordResourceIdentifier<T>,
	FoundCommentWordAttributes<"serialized">
>

export type DeserializedFoundCommentWordResource<
T extends FoundCommentWordRelationshipNames|undefined = undefined
> = DeserializedResource<
	FoundCommentWordResourceIdentifier<"read">,
	FoundCommentWordAttributes<"deserialized">
> & PartialOrPickDeserializedRelationship<
	FoundCommentWordRelationshipData<"read">,
	DeserializedFoundCommentWordRelationships<"read">,
	FoundCommentWordRelationshipNames,
	T extends FoundCommentWordRelationshipNames ? true : false,
	T extends FoundCommentWordRelationshipNames ? T : FoundCommentWordRelationshipNames
>

export type FoundCommentWordDocument<T extends Completeness = "read"> = ResourceDocument<
	T,
	FoundCommentWordResourceIdentifier<T>,
	FoundCommentWordAttributes<"serialized">,
	FoundCommentWordResource<T>
>

export type FoundCommentWordListDocument<
T extends Completeness = "read"> = ResourceListDocument<
	T,
	FoundCommentWordResourceIdentifier<T>,
	FoundCommentWordAttributes<"serialized">,
	FoundCommentWordResource<T>
>

export type DeserializedFoundCommentWordDocument<
	T extends FoundCommentWordRelationshipNames|undefined = undefined
> = DeserializedResourceDocument<
	FoundCommentWordResourceIdentifier<"read">,
	FoundCommentWordAttributes<"deserialized">,
	DeserializedFoundCommentWordResource<T>
>

export type DeserializedFoundCommentWordListDocument<
	T extends FoundCommentWordRelationshipNames|undefined = undefined
> = DeserializedResourceListDocument<
	FoundCommentWordResourceIdentifier<"read">,
	FoundCommentWordAttributes<"deserialized">,
	DeserializedFoundCommentWordResource<T>
>
