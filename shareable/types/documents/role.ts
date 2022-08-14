import type { RequirePassword } from "$/types/documents/security"
import type {
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

export interface RoleResourceIdentifier <T extends string|number = string>
extends ResourceIdentifier<T> {
	type: "role",
	meta?: {
		userCount: number
	}
}

export interface RoleAttributes extends Attributes {
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

export type RoleResource = Resource<RoleResourceIdentifier, RoleAttributes>

export type DeserializedRoleResource<T extends string|number = string> = DeserializedResource<
	T,
	RoleResourceIdentifier<T>,
	RoleAttributes
>

export type RoleDocument = ResourceDocument<
	RoleResourceIdentifier,
	RoleAttributes,
	RoleResource
>

export type RoleListDocument = ResourceListDocument<
	RoleResourceIdentifier,
	RoleAttributes,
	RoleResource
>

export type DeserializedRoleDocument<T extends string|number = string>
= DeserializedResourceDocument<
	T,
	RoleResourceIdentifier<T>,
	RoleAttributes,
	DeserializedRoleResource<T>
>

export type DeserializedRoleListDocument<T extends string|number = string>
= DeserializedResourceListDocument<
	T,
	RoleResourceIdentifier<T>,
	RoleAttributes,
	DeserializedRoleResource<T>
>

export type RoleIdentifierDocument<T extends string|number = string>
= IdentifierDocument<T, RoleResourceIdentifier<T>>

export type RoleIdentifierListDocument<T extends string|number = string>
= IdentifierListDocument<T, RoleResourceIdentifier<T>>

export type UpdatedRoleDocument = RoleDocument & RequirePassword
