
import type { Serializable } from "$/types/general"
import type { RequirePassword } from "$/types/documents/security"
import type {
	Completeness,
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

export interface DepartmentResourceIdentifier<T extends Completeness = "read">
extends ResourceIdentifier<T> {
	type: "department",
	meta: T extends "read" ? {
		userCount: number
	}: undefined
}

export interface DepartmentAttributes<T extends Format = "serialized"> extends Attributes<T> {
	fullName: string,
	acronym: string,
	mayAdmit: boolean
}

export type DepartmentResource<T extends Completeness = "read"> = Resource<
	T,
	DepartmentResourceIdentifier<T>,
	DepartmentAttributes<"serialized">
>

export type DeserializedDepartmentResource = DeserializedResource<
	DepartmentResourceIdentifier<"read">,
	DepartmentAttributes<"deserialized">
>

export type DepartmentDocument<T extends Completeness = "read"> = ResourceDocument<
	T,
	DepartmentResourceIdentifier<T>,
	DepartmentAttributes<"serialized">,
	DepartmentResource<T>
> & (
	T extends "update" ? RequirePassword : Serializable
)

export type DepartmentListDocument<T extends Completeness = "read"> = ResourceListDocument<
	T,
	DepartmentResourceIdentifier<T>,
	DepartmentAttributes<"serialized">,
	DepartmentResource<T>
>

export type DeserializedDepartmentDocument
= DeserializedResourceDocument<
	DepartmentResourceIdentifier<"read">,
	DepartmentAttributes<"deserialized">,
	DeserializedDepartmentResource
>

export type DeserializedDepartmentListDocument
= DeserializedResourceListDocument<
	DepartmentResourceIdentifier<"read">,
	DepartmentAttributes<"deserialized">,
	DeserializedDepartmentResource
>

export type DepartmentIdentifierDocument
= IdentifierDocument<DepartmentResourceIdentifier<"read">>

export type DepartmentIdentifierListDocument
= IdentifierListDocument<DepartmentResourceIdentifier<"read">>
