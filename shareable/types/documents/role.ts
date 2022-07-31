import type {
	Attributes,
	ResourceIdentifier,
	DeserializedResource
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

export interface DeserializeRoleResource extends DeserializedResource<
	RoleResourceIdentifier,
	RoleAttributes
> {}
