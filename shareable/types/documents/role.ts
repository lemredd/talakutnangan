import type {
	Attributes,
	ResourceIdentifierObject,
	DeserializedResourceObject
} from "$/types/documents/base"

export interface RoleResourceIdentifierObject extends ResourceIdentifierObject {
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

export interface DeserializeRoleResourceObject extends DeserializedResourceObject<
	RoleResourceIdentifierObject,
	RoleAttributes
> {}
