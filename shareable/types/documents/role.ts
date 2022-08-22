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

export interface RoleResourceIdentifier<T extends Completeness = "read">
extends ResourceIdentifier<T> {
	type: "role",
	meta: T extends "read" ? ({
		userCount: number
	} | undefined): undefined
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
	deletedAt?: string | null
}

export type RoleResource<T extends Completeness = "read"> = Resource<
	T,
	RoleResourceIdentifier<T>,
	RoleAttributes<"serialized">
>

export type DeserializedRoleResource = DeserializedResource<
	RoleResourceIdentifier<"read">,
	RoleAttributes<"deserialized">
>

export type RoleDocument<T extends Completeness = "read"> = ResourceDocument<
	T,
	RoleResourceIdentifier<T>,
	RoleAttributes<"serialized">,
	RoleResource<T>
> & (
	T extends "update" ? RequirePassword : Serializable
)

export type RoleListDocument<T extends Completeness = "read"> = ResourceListDocument<
	T,
	RoleResourceIdentifier<T>,
	RoleAttributes<"serialized">,
	RoleResource<T>
>

export type DeserializedRoleDocument = DeserializedResourceDocument<
	RoleResourceIdentifier<"read">,
	RoleAttributes<"deserialized">,
	DeserializedRoleResource
>

export type DeserializedRoleListDocument = DeserializedResourceListDocument<
	RoleResourceIdentifier<"read">,
	RoleAttributes<"deserialized">,
	DeserializedRoleResource
>

export type RoleIdentifierDocument
= IdentifierDocument<RoleResourceIdentifier<"read">>

export type RoleIdentifierListDocument
= IdentifierListDocument<RoleResourceIdentifier<"read">>
