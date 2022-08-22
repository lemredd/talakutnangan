import type { Serializable } from "$/types/general"
import type { DeserializedRoleListDocument } from "$/types/documents/role"
import type { DeserializedSignatureDocument } from "$/types/documents/signature"
import type { DeserializedDepartmentDocument } from "$/types/documents/department"
import type { DeserializedStudentDetailDocument } from "$/types/documents/student_detail"
import type { DeserializedProfilePictureDocument } from "$/types/documents/profile_picture"
import type { DeserializedEmployeeScheduleListDocument } from "$/types/documents/employee_schedule"
import type {
	Completeness,
	Format,

	Resource,
	Attributes,
	ResourceIdentifier,
	DeserializedResource,

	MetaDocument,
	ResourceDocument,
	ResourceListDocument,
	DeserializedResourceDocument,
	DeserializedResourceListDocument,

	IdentifierDocument,
	IdentifierListDocument
} from "$/types/documents/base"

export interface UserResourceIdentifier<T extends Completeness = "read">
extends ResourceIdentifier<T> {
	type: "user"
}

interface GeneralUserAttributes<T extends Format = "serialized"> extends Attributes<T> {
	name: string,
	email: string,
	prefersDark: T extends "deserialized" ? boolean : boolean|undefined
}

export interface StudentAttributes<T extends Format = "serialized">
extends GeneralUserAttributes<T> {
	kind: "student"
}

export interface ReachableEmployeesAttributes<T extends Format = "serialized">
extends GeneralUserAttributes<T> {
	kind: "reachable_employee"
}

export interface UnreachableEmployeesAttributes<T extends Format = "serialized">
extends GeneralUserAttributes<T> {
	kind: "unreachable_employee"
}

export type UserAttributes<T extends Format = "serialized"> =
	| StudentAttributes<T>
	| ReachableEmployeesAttributes<T>
	| UnreachableEmployeesAttributes<T>

interface DeserializedGeneralUserAttributes extends GeneralUserAttributes<"deserialized"> {
	department: DeserializedDepartmentDocument,
	roles: DeserializedRoleListDocument,
	profilePicture?: DeserializedProfilePictureDocument,
	signature?: DeserializedSignatureDocument
}

interface DeserializedStudentAttributes
extends DeserializedGeneralUserAttributes, StudentAttributes<"deserialized"> {
	studentDetail: DeserializedStudentDetailDocument
}

interface DeserializedReachableEmployeesAttributes
extends DeserializedGeneralUserAttributes, ReachableEmployeesAttributes<"deserialized"> {
	employeeSchedules: DeserializedEmployeeScheduleListDocument
}

interface DeserializedUnreachableEmployeesAttributes
extends DeserializedGeneralUserAttributes, UnreachableEmployeesAttributes<"deserialized"> {}

export type DeserializedUserAttributes =
	| DeserializedStudentAttributes
	| DeserializedReachableEmployeesAttributes
	| DeserializedUnreachableEmployeesAttributes

export type UserResource<T extends Completeness = "read"> = Resource<
	T,
	UserResourceIdentifier<T>,
	UserAttributes<"serialized">
>

type DeserializedStudentResource = DeserializedResource<
	UserResourceIdentifier<"read">,
	DeserializedStudentAttributes
>

type DeserializedReachableEmployeesResource = DeserializedResource<
	UserResourceIdentifier<"read">,
	DeserializedReachableEmployeesAttributes
>

type DeserializedUnreachableEmployeesResource = DeserializedResource<
	UserResourceIdentifier<"read">,
	DeserializedUnreachableEmployeesAttributes
>

export type DeserializedUserResource =
	| DeserializedStudentResource
	| DeserializedReachableEmployeesResource
	| DeserializedUnreachableEmployeesResource

export type UserDocument<T extends Completeness = "read"> = ResourceDocument<
	T,
	UserResourceIdentifier<T>,
	UserAttributes<"serialized">,
	UserResource<T>
>

export type UserListDocument<T extends Completeness = "read"> = ResourceListDocument<
	T,
	UserResourceIdentifier<T>,
	UserAttributes<"serialized">,
	UserResource<T>
>

export type DeserializedUserDocument = DeserializedResourceDocument<
	UserResourceIdentifier<"read">,
	DeserializedUserAttributes,
	DeserializedUserResource
>

export type DeserializedUserListDocument = DeserializedResourceListDocument<
	UserResourceIdentifier<"read">,
	DeserializedUserAttributes,
	DeserializedUserResource
>

interface GeneralUserProfileMetaProperties extends Serializable {
	hasDefaultPassword?: boolean
}

export interface DeserializedUserProfile
extends DeserializedUserDocument, MetaDocument<GeneralUserProfileMetaProperties> {}

export type UserIdentifierDocument
= IdentifierDocument<UserResourceIdentifier<"read">>

export type UserIdentifierListDocument
= IdentifierListDocument<UserResourceIdentifier<"read">>
