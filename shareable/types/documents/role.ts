import type {
	Resource,
	Attributes,
	ResourceIdentifier,
	DeserializedResource,
	CompleteDataDocument,
	CompleteDataListDocument,
	DeserializedCompleteDataDocument,
	DeserializedCompleteDataListDocument
} from "$/types/documents/base"

export interface RoleResourceIdentifier extends ResourceIdentifier {
	type: "role"
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
	auditTrailFlags: number
}

export interface RoleResource extends Resource<RoleResourceIdentifier, RoleAttributes> {}

export interface DeserializedRoleResource extends DeserializedResource<
	RoleResourceIdentifier,
	RoleAttributes
> {}

export interface CompleteRoleDataDocument extends CompleteDataDocument<
	RoleResourceIdentifier,
	RoleAttributes,
	RoleResource
> {}

export interface CompleteRoleDataListDocument extends CompleteDataListDocument<
	RoleResourceIdentifier,
	RoleAttributes,
	RoleResource
> {}

export interface DeserializedCompleteRoleDataDocument extends DeserializedCompleteDataDocument<
	RoleResourceIdentifier,
	RoleAttributes,
	DeserializedRoleResource
> {}

export interface DeserializedCompleteRoleDataListDocument
extends DeserializedCompleteDataListDocument<
	RoleResourceIdentifier,
	RoleAttributes,
	DeserializedRoleResource
> {}
