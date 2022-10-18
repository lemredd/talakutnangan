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

export type DepartmentResourceIdentifier<T extends Completeness = "read">
= ResourceIdentifier<CompletenessRegulator<T>> & PaginatedDocument<T> & {
	type: "department"
}

export interface DepartmentAttributes<T extends Format = "serialized"> extends Attributes<T> {
	fullName: string,
	acronym: string,
	mayAdmit: boolean
}

export type DepartmentResource<T extends Completeness = "read"> = Resource<
	CompletenessRegulator<T>,
	DepartmentResourceIdentifier<T>,
	DepartmentAttributes<"serialized">
>

export type DeserializedDepartmentResource<T extends ReadableCompleteness = "read">
= DeserializedResource<
	DepartmentResourceIdentifier<T>,
	DepartmentAttributes<"deserialized">
>

export type DepartmentDocument<T extends Completeness = "read"> = ResourceDocument<
	CompletenessRegulator<T>,
	DepartmentResourceIdentifier<T>,
	DepartmentAttributes<"serialized">,
	DepartmentResource<T>
> & (
	T extends "update" ? RequirePassword : Serializable
)

export type DepartmentListDocument<T extends Completeness = "read"> = ResourceListDocument<
	CompletenessRegulator<T>,
	DepartmentResourceIdentifier<T>,
	DepartmentAttributes<"serialized">,
	DepartmentResource<T>
>

export type DeserializedDepartmentDocument<T extends ReadableCompleteness = "read">
= DeserializedResourceDocument<
	DepartmentResourceIdentifier<T>,
	DepartmentAttributes<"deserialized">,
	DeserializedDepartmentResource<T>
>

export type DeserializedDepartmentListDocument<T extends ReadableCompleteness = "read">
= DeserializedResourceListDocument<
	DepartmentResourceIdentifier<T>,
	DepartmentAttributes<"deserialized">,
	DeserializedDepartmentResource<T>
>

export type DepartmentIdentifierDocument<T extends ReadableCompleteness = "read">
= IdentifierDocument<DepartmentResourceIdentifier<T>>

export type DepartmentIdentifierListDocument<T extends ReadableCompleteness = "read">
= IdentifierListDocument<DepartmentResourceIdentifier<T>>
