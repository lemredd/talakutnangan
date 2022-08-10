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

export interface UserResourceIdentifier extends ResourceIdentifier {
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
	UserResourceIdentifier,
	UserAttributes
>

type DeserializedStudentResource = DeserializedResource<
	UserResourceIdentifier,
	DeserializedStudentAttributes
>

type DeserializedReachableEmployeesResource = DeserializedResource<
	UserResourceIdentifier,
	DeserializedReachableEmployeesAttributes
>

type DeserializedUnreachableEmployeesResource = DeserializedResource<
	UserResourceIdentifier,
	DeserializedUnreachableEmployeesAttributes
>

export type DeserializedUserResource =
	| DeserializedStudentResource
	| DeserializedReachableEmployeesResource
	| DeserializedUnreachableEmployeesResource

export type UserDocument = ResourceDocument<
	UserResourceIdentifier,
	UserAttributes,
	UserResource
>

export type UserListDocument = ResourceListDocument<
	UserResourceIdentifier,
	UserAttributes,
	UserResource
>

export type DeserializedUserDocument = DeserializedResourceDocument<
	UserResourceIdentifier,
	DeserializedUserAttributes,
	DeserializedUserResource
>

export type DeserializedUserListDocument = DeserializedResourceListDocument<
	UserResourceIdentifier,
	DeserializedUserAttributes,
	DeserializedUserResource
>

interface GeneralUserProfileMetaProperties extends Serializable {
	hasDefaultPassword?: boolean
}

export interface DeserializedUserProfile
extends DeserializedUserDocument, MetaDocument<GeneralUserProfileMetaProperties> {}
