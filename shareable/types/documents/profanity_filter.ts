import type { Serializable } from "$/types/general"
import type { RequirePassword } from "$/types/documents/security"
import type {
	AttachableCompleteness as Completeness,
	CompletenessRegulator,
	ReadableCompleteness,
	PaginatedDocument
} from "$/types/documents/irregularity"
import type {
	Format,
	Resource,
	Attributes,
	ResourceIdentifier,
	DeserializedResource,
	ResourceDocument,
	ResourceListDocument,
	DeserializedResourceDocument,
	DeserializedResourceListDocument,
	IdentifierDocument,
	IdentifierListDocument
} from "$/types/documents/base"

export type ProfanityFilterResourceIdentifier<T extends Completeness = "read">
= ResourceIdentifier<CompletenessRegulator<T>> & PaginatedDocument<T> & {
	type: "profanity_filter"
}

export interface ProfanityFilterAttributes<T extends Format = "serialized"> extends Attributes<T> {
	name: string,
	deletedAt: (T extends "serialized" ? string : Date)|null
}

export type ProfanityFilterResource<T extends Completeness = "read"> = Resource<
	CompletenessRegulator<T>,
	ProfanityFilterResourceIdentifier<T>,
	ProfanityFilterAttributes<"serialized">
>

export type DeserializedProfanityFilterResource<T extends ReadableCompleteness = "read">
= DeserializedResource<
	ProfanityFilterResourceIdentifier<T>,
	ProfanityFilterAttributes<"deserialized">
>

export type ProfanityFilterDocument<T extends Completeness = "read"> = ResourceDocument<
	CompletenessRegulator<T>,
	ProfanityFilterResourceIdentifier<T>,
	ProfanityFilterAttributes<"serialized">,
	ProfanityFilterResource<T>
> & (
	T extends "update" ? RequirePassword : Serializable
)

export type ProfanityFilterListDocument<T extends Completeness = "read"> = ResourceListDocument<
	CompletenessRegulator<T>,
	ProfanityFilterResourceIdentifier<T>,
	ProfanityFilterAttributes<"serialized">,
	ProfanityFilterResource<T>
>

export type DeserializedProfanityFilterDocument<T extends ReadableCompleteness = "read">
= DeserializedResourceDocument<
	ProfanityFilterResourceIdentifier<T>,
	ProfanityFilterAttributes<"deserialized">,
	DeserializedProfanityFilterResource<T>
>

export type DeserializedProfanityFilterListDocument<T extends ReadableCompleteness = "read">
= DeserializedResourceListDocument<
	ProfanityFilterResourceIdentifier<T>,
	ProfanityFilterAttributes<"deserialized">,
	DeserializedProfanityFilterResource<T>
>

export type ProfanityFilterIdentifierDocument<T extends ReadableCompleteness = "read">
= IdentifierDocument<ProfanityFilterResourceIdentifier<T>>

export type ProfanityFilterIdentifierListDocument<T extends ReadableCompleteness = "read">
= IdentifierListDocument<ProfanityFilterResourceIdentifier<T>>
