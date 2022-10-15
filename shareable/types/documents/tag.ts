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

export type DeserializedTagResource<T extends ReadableCompleteness = "read">
= DeserializedResource<
	TagResourceIdentifier<T>,
	TagAttributes<"deserialized">
>

export type TagDocument<T extends Completeness = "read"> = ResourceDocument<
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

export type DeserializedTagDocument<T extends ReadableCompleteness = "read">
= DeserializedResourceDocument<
	TagResourceIdentifier<T>,
	TagAttributes<"deserialized">,
	DeserializedTagResource<T>
>

export type DeserializedTagListDocument<T extends ReadableCompleteness = "read">
= DeserializedResourceListDocument<
	TagResourceIdentifier<T>,
	TagAttributes<"deserialized">,
	DeserializedTagResource<T>
>

export type TagIdentifierDocument<T extends ReadableCompleteness = "read">
= IdentifierDocument<TagResourceIdentifier<T>>

export type TagIdentifierListDocument<T extends ReadableCompleteness = "read">
= IdentifierListDocument<TagResourceIdentifier<T>>
