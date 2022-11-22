/**
 * @description This module should not be used in production code. It only for testing purposes.
 */
import type { DeserializedPostDocument, PostIdentifierDocument } from "$/types/documents/post"
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

export interface FoundPostWordResourceIdentifier<T extends Completeness = "read">
extends ResourceIdentifier<T> {
	type: "found_post_word"
}

export type FoundPostWordAttributes<T extends Format = "serialized"> = Attributes<T>

interface FoundPostWordRelationshipData<unusedT extends Completeness = "read">
extends GeneralRelationshipData {
	profanity_filter: {
		serialized: ProfanityFilterIdentifierDocument,
		deserialized: DeserializedProfanityFilterDocument,
	},
	post: {
		serialized: PostIdentifierDocument,
		deserialized: DeserializedPostDocument
	}
}

export type FoundPostWordRelationshipNames
= DeriveRelationshipNames<FoundPostWordRelationshipData>

export type FoundPostWordRelationships<T extends Completeness = "read">
= DeriveRelationships<FoundPostWordRelationshipData<T>>

export type DeserializedFoundPostWordRelationships<T extends Completeness = "read">
= DeriveDeserializedRelationships<FoundPostWordRelationshipData<T>>

export type FoundPostWordResource<T extends Completeness = "read"> = Resource<
	T,
	FoundPostWordResourceIdentifier<T>,
	FoundPostWordAttributes<"serialized">
>

export type DeserializedFoundPostWordResource<
T extends FoundPostWordRelationshipNames|undefined = undefined
> = DeserializedResource<
	FoundPostWordResourceIdentifier<"read">,
	FoundPostWordAttributes<"deserialized">
> & PartialOrPickDeserializedRelationship<
	FoundPostWordRelationshipData<"read">,
	DeserializedFoundPostWordRelationships<"read">,
	FoundPostWordRelationshipNames,
	T extends FoundPostWordRelationshipNames ? true : false,
	T extends FoundPostWordRelationshipNames ? T : FoundPostWordRelationshipNames
>

export type FoundPostWordDocument<T extends Completeness = "read"> = ResourceDocument<
	T,
	FoundPostWordResourceIdentifier<T>,
	FoundPostWordAttributes<"serialized">,
	FoundPostWordResource<T>
>

export type FoundPostWordListDocument<T extends Completeness = "read"> = ResourceListDocument<
	T,
	FoundPostWordResourceIdentifier<T>,
	FoundPostWordAttributes<"serialized">,
	FoundPostWordResource<T>
>

export type DeserializedFoundPostWordDocument<
	T extends FoundPostWordRelationshipNames|undefined = undefined
> = DeserializedResourceDocument<
	FoundPostWordResourceIdentifier<"read">,
	FoundPostWordAttributes<"deserialized">,
	DeserializedFoundPostWordResource<T>
>

export type DeserializedFoundPostWordListDocument<
	T extends FoundPostWordRelationshipNames|undefined = undefined
> = DeserializedResourceListDocument<
	FoundPostWordResourceIdentifier<"read">,
	FoundPostWordAttributes<"deserialized">,
	DeserializedFoundPostWordResource<T>
>
