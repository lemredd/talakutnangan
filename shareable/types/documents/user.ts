import type { Serializable } from "$/types/general"
import type { DeserializedRoleListDocument } from "$/types/documents/role"
import type { DeserializedSignatureDocument } from "$/types/documents/signature"
import type { DeserializedDepartmentDocument } from "$/types/documents/department"
import type { DeserializedStudentDetailDocument } from "$/types/documents/student_detail"
import type { DeserializedProfilePictureDocument } from "$/types/documents/profile_picture"
import type { DeserializedEmployeeScheduleListDocument } from "$/types/documents/employee_schedule"
import type {
	Resource,
	Attributes,
	ResourceIdentifier,
	DeserializedResource,

	MetaDocument,
	ResourceDocument,
	ResourceListDocument,
	DeserializedResourceDocument,
	DeserializedResourceListDocument
} from "$/types/documents/base"

export interface UserResourceIdentifier<T extends string|number = string>
extends ResourceIdentifier<T> {
	type: "user"
}

interface GeneralUserAttributes extends Attributes {
	name: string,
	email: string,
	prefersDark?: boolean
}

export interface StudentAttributes extends GeneralUserAttributes {
	kind: "student"
}

export interface ReachableEmployeesAttributes extends GeneralUserAttributes {
	kind: "reachable_employee"
}

export interface UnreachableEmployeesAttributes extends GeneralUserAttributes {
	kind: "unreachable_employee"
}

export type UserAttributes =
	| StudentAttributes
	| ReachableEmployeesAttributes
	| UnreachableEmployeesAttributes

interface DeserializedGeneralUserAttributes extends GeneralUserAttributes {
	department: DeserializedDepartmentDocument,
	roles: DeserializedRoleListDocument,
	profilePicture?: DeserializedProfilePictureDocument,
	signature?: DeserializedSignatureDocument
}

interface DeserializedStudentAttributes
extends DeserializedGeneralUserAttributes, StudentAttributes {
	studentDetail: DeserializedStudentDetailDocument
}

interface DeserializedReachableEmployeesAttributes
extends DeserializedGeneralUserAttributes, ReachableEmployeesAttributes {
	employeeSchedules: DeserializedEmployeeScheduleListDocument
}

interface DeserializedUnreachableEmployeesAttributes
extends DeserializedGeneralUserAttributes, UnreachableEmployeesAttributes {}

export type DeserializedUserAttributes =
	| DeserializedStudentAttributes
	| DeserializedReachableEmployeesAttributes
	| DeserializedUnreachableEmployeesAttributes

export type UserResource = Resource<
	string,
	UserResourceIdentifier,
	UserAttributes
>

type DeserializedStudentResource<T extends string|number = string>
= DeserializedResource<
	T,
	UserResourceIdentifier<T>,
	DeserializedStudentAttributes
>

type DeserializedReachableEmployeesResource<T extends string|number = string>
= DeserializedResource<
	T,
	UserResourceIdentifier<T>,
	DeserializedReachableEmployeesAttributes
>

type DeserializedUnreachableEmployeesResource<T extends string|number = string>
= DeserializedResource<
	T,
	UserResourceIdentifier<T>,
	DeserializedUnreachableEmployeesAttributes
>

export type DeserializedUserResource<T extends string|number = string> =
	| DeserializedStudentResource<T>
	| DeserializedReachableEmployeesResource<T>
	| DeserializedUnreachableEmployeesResource<T>

export type UserDocument = ResourceDocument<
	string,
	UserResourceIdentifier,
	UserAttributes,
	UserResource
>

export type UserListDocument = ResourceListDocument<
	string,
	UserResourceIdentifier,
	UserAttributes,
	UserResource
>

export type DeserializedUserDocument<T extends string|number = string>
= DeserializedResourceDocument<
	T,
	UserResourceIdentifier<T>,
	DeserializedUserAttributes,
	DeserializedUserResource<T>
>

export type DeserializedUserListDocument<T extends string|number = string>
= DeserializedResourceListDocument<
	T,
	UserResourceIdentifier<T>,
	DeserializedUserAttributes,
	DeserializedUserResource<T>
>

interface GeneralUserProfileMetaProperties extends Serializable {
	hasDefaultPassword?: boolean
}

export interface DeserializedUserProfile<T extends string|number = string>
extends DeserializedUserDocument<T>, MetaDocument<GeneralUserProfileMetaProperties> {}
