import type {
	Resource,
	Attributes,
	ResourceIdentifier,
	DeserializedResource,
	ResourceDocument,
	ResourceListDocument,
	DeserializedResourceDocument,
	DeserializedResourceListDocument
} from "$/types/documents/base"

export interface RoleResourceIdentifier extends ResourceIdentifier {
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

export type DeserializedRoleResource = DeserializedResource<
	RoleResourceIdentifier,
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

export type DeserializedRoleDocument = DeserializedResourceDocument<
	RoleResourceIdentifier,
	RoleAttributes,
	DeserializedRoleResource
>

export type DeserializedRoleListDocument = DeserializedResourceListDocument<
	RoleResourceIdentifier,
	RoleAttributes,
	DeserializedRoleResource
>
