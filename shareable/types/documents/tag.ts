import type { Serializable } from "$/types/general"
import type { RequirePassword } from "$/types/documents/security"
import type {
	PostIdentifierDocument,
	DeserializedPostDocument
} from "$/types/documents/post"
import type {
	AttachableCompleteness as Completeness,
	CompletenessRegulator,
	ReadableCompleteness,
	PaginatedDocument
} from "$/types/documents/irregularity"
import type {
	Format,
	Attributes,

	Resource,
	ResourceIdentifier,
	DeserializedResource,

	DeriveRelationships,
	DeriveRelationshipNames,
	GeneralRelationshipData,
	DeriveDeserializedRelationships,
	PartialOrPickDeserializedRelationship,

	ResourceDocument,
	ResourceListDocument,
	DeserializedResourceDocument,
	DeserializedResourceListDocument,

	IdentifierDocument,
	IdentifierListDocument
} from "$/types/documents/base"

export type TagResourceIdentifier<T extends Completeness = "read">
= ResourceIdentifier<CompletenessRegulator<T>> & PaginatedDocument<T> & {
	type: "tag"
}

export interface TagAttributes<T extends Format = "serialized"> extends Attributes<T> {
	name: string,
	deletedAt: (T extends "serialized" ? string : Date)|null
}

export type TagResource<T extends Completeness = "read"> = Resource<
	CompletenessRegulator<T>,
	TagResourceIdentifier<T>,
	TagAttributes<"serialized">
>

interface TagRelationshipData<unusedT extends Completeness = "read">
extends GeneralRelationshipData {
	post: {
		serialized: PostIdentifierDocument,
		deserialized: DeserializedPostDocument
	}
}

export type TagRelationshipNames = DeriveRelationshipNames<TagRelationshipData>

export type TagRelationships<T extends Completeness = "read">
= DeriveRelationships<TagRelationshipData<T>>

export type DeserializedTagRelationships<T extends Completeness = "read">
= DeriveDeserializedRelationships<TagRelationshipData<T>>

export type DeserializedTagResource<
	T extends ReadableCompleteness = "read",
	U extends TagRelationshipNames|undefined = undefined
>
= DeserializedResource<
	TagResourceIdentifier<T>,
	TagAttributes<"deserialized">
> & PartialOrPickDeserializedRelationship<
	TagRelationshipData<"read">,
	DeserializedTagRelationships<"read">,
	TagRelationshipNames,
	U extends TagRelationshipNames ? true : false,
	U extends TagRelationshipNames ? U : TagRelationshipNames
>


export type TagDocument<
	T extends Completeness = "read",
> = ResourceDocument<
	CompletenessRegulator<T>,
	TagResourceIdentifier<T>,
	TagAttributes<"serialized">,
	TagResource<T>
> & (
	T extends "update" ? RequirePassword : Serializable
)

export type TagListDocument<T extends Completeness = "read"> = ResourceListDocument<
	CompletenessRegulator<T>,
	TagResourceIdentifier<T>,
	TagAttributes<"serialized">,
	TagResource<T>
>

export type DeserializedTagDocument<
	T extends ReadableCompleteness = "read",
	U extends TagRelationshipNames|undefined = undefined

>
= DeserializedResourceDocument<
	TagResourceIdentifier<T>,
	TagAttributes<"deserialized">,
	DeserializedTagResource<T, U>
>

export type DeserializedTagListDocument<
	T extends ReadableCompleteness = "read",
	U extends TagRelationshipNames|undefined = undefined
>
= DeserializedResourceListDocument<
	TagResourceIdentifier<T>,
	TagAttributes<"deserialized">,
	DeserializedTagResource<T, U>
>

export type TagIdentifierDocument<T extends ReadableCompleteness = "read">
= IdentifierDocument<TagResourceIdentifier<T>>

export type TagIdentifierListDocument<T extends ReadableCompleteness = "read">
= IdentifierListDocument<TagResourceIdentifier<T>>
