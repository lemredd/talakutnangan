import type {
	Attributes,
	ResourceIdentifierObject,
	DserializedResourceObject
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

export interface DeserializeRoleResourceObject extends DserializedResourceObject<
	RoleResourceIdentifierObject,
	RoleAttributes
> {}
