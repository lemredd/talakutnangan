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

export type SemesterResourceIdentifier<T extends Completeness = "read">
= ResourceIdentifier<CompletenessRegulator<T>> & PaginatedDocument<T> & {
	type: "semester"
}

export interface SemesterAttributes<T extends Format = "serialized"> extends Attributes<T> {
	name: string,
	semesterOrder: number,
	startAt: Date,
	endAt: Date,
	deletedAt: (T extends "serialized" ? string : Date)|null
}

export type SemesterResource<T extends Completeness = "read"> = Resource<
	CompletenessRegulator<T>,
	SemesterResourceIdentifier<T>,
	SemesterAttributes<"serialized">
>

export type DeserializedSemesterResource<T extends ReadableCompleteness = "read">
= DeserializedResource<
	SemesterResourceIdentifier<T>,
	SemesterAttributes<"deserialized">
>

export type SemesterDocument<T extends Completeness = "read"> = ResourceDocument<
	CompletenessRegulator<T>,
	SemesterResourceIdentifier<T>,
	SemesterAttributes<"serialized">,
	SemesterResource<T>
> & (
	T extends "update" ? RequirePassword : Serializable
)

export type SemesterListDocument<T extends Completeness = "read"> = ResourceListDocument<
	CompletenessRegulator<T>,
	SemesterResourceIdentifier<T>,
	SemesterAttributes<"serialized">,
	SemesterResource<T>
>

export type DeserializedSemesterDocument<T extends ReadableCompleteness = "read">
= DeserializedResourceDocument<
	SemesterResourceIdentifier<T>,
	SemesterAttributes<"deserialized">,
	DeserializedSemesterResource<T>
>

export type DeserializedSemesterListDocument<T extends ReadableCompleteness = "read">
= DeserializedResourceListDocument<
	SemesterResourceIdentifier<T>,
	SemesterAttributes<"deserialized">,
	DeserializedSemesterResource<T>
>

export type SemesterIdentifierDocument<T extends ReadableCompleteness = "read">
= IdentifierDocument<SemesterResourceIdentifier<T>>

export type SemesterIdentifierListDocument<T extends ReadableCompleteness = "read">
= IdentifierListDocument<SemesterResourceIdentifier<T>>
