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

export interface RoleResource extends Resource<RoleResourceIdentifier, RoleAttributes> {}

export interface DeserializedRoleResource extends DeserializedResource<
	RoleResourceIdentifier,
	RoleAttributes
> {}

export interface RoleDocument extends ResourceDocument<
	RoleResourceIdentifier,
	RoleAttributes,
	RoleResource
> {}

export interface RoleListDocument extends ResourceListDocument<
	RoleResourceIdentifier,
	RoleAttributes,
	RoleResource
> {}

export interface DeserializedRoleDocument extends DeserializedResourceDocument<
	RoleResourceIdentifier,
	RoleAttributes,
	DeserializedRoleResource
> {}

export interface DeserializedRoleListDocument extends DeserializedResourceListDocument<
	RoleResourceIdentifier,
	RoleAttributes,
	DeserializedRoleResource
> {}
