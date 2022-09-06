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

export type RoleResourceIdentifier<T extends Completeness = "read">
= ResourceIdentifier<CompletenessRegulator<T>> & PaginatedDocument<T> & {
	type: "role"
}

export interface RoleAttributes<T extends Format = "serialized"> extends Attributes<T> {
	name: string,
	departmentFlags: number,
	roleFlags: number,
	semesterFlags: number,
	tagFlags: number,
	postFlags: number,
	commentFlags: number,
	profanityFlags: number,
	userFlags: number,
	auditTrailFlags: number,
	deletedAt: (T extends "serialized" ? string : Date)|null
}

export type RoleResource<T extends Completeness = "read"> = Resource<
	CompletenessRegulator<T>,
	RoleResourceIdentifier<T>,
	RoleAttributes<"serialized">
>

export type DeserializedRoleResource<T extends ReadableCompleteness = "read">
= DeserializedResource<
	RoleResourceIdentifier<T>,
	RoleAttributes<"deserialized">
>

export type RoleDocument<T extends Completeness = "read"> = ResourceDocument<
	CompletenessRegulator<T>,
	RoleResourceIdentifier<T>,
	RoleAttributes<"serialized">,
	RoleResource<T>
> & (
	T extends "update" ? RequirePassword : Serializable
)

export type RoleListDocument<T extends Completeness = "read"> = ResourceListDocument<
	CompletenessRegulator<T>,
	RoleResourceIdentifier<T>,
	RoleAttributes<"serialized">,
	RoleResource<T>
>

export type DeserializedRoleDocument<T extends ReadableCompleteness = "read">
= DeserializedResourceDocument<
	RoleResourceIdentifier<T>,
	RoleAttributes<"deserialized">,
	DeserializedRoleResource<T>
>

export type DeserializedRoleListDocument<T extends ReadableCompleteness = "read">
= DeserializedResourceListDocument<
	RoleResourceIdentifier<T>,
	RoleAttributes<"deserialized">,
	DeserializedRoleResource<T>
>

export type RoleIdentifierDocument<T extends ReadableCompleteness = "read">
= IdentifierDocument<RoleResourceIdentifier<T>>

export type RoleIdentifierListDocument<T extends ReadableCompleteness = "read">
= IdentifierListDocument<RoleResourceIdentifier<T>>
