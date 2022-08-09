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

export interface UserResource extends Resource<
	UserResourceIdentifier,
	UserAttributes
> {}

interface DeserializedStudentResource extends DeserializedResource<
	UserResourceIdentifier,
	DeserializedStudentAttributes
> {}

interface DeserializedReachableEmployeesResource extends DeserializedResource<
	UserResourceIdentifier,
	DeserializedReachableEmployeesAttributes
> {}

interface DeserializedUnreachableEmployeesResource extends DeserializedResource<
	UserResourceIdentifier,
	DeserializedUnreachableEmployeesAttributes
> {}

export type DeserializedUserResource =
	| DeserializedStudentResource
	| DeserializedReachableEmployeesResource
	| DeserializedUnreachableEmployeesResource

export interface UserDocument extends ResourceDocument<
	UserResourceIdentifier,
	UserAttributes,
	UserResource
> {}

export interface UserListDocument extends ResourceListDocument<
	UserResourceIdentifier,
	UserAttributes,
	UserResource
> {}

export interface DeserializedUserDocument extends DeserializedResourceDocument<
	UserResourceIdentifier,
	DeserializedUserAttributes,
	DeserializedUserResource
> {}

export interface DeserializedUserListDocument extends DeserializedResourceListDocument<
	UserResourceIdentifier,
	DeserializedUserAttributes,
	DeserializedUserResource
> {}

interface GeneralUserProfileMetaProperties extends Serializable {
	hasDefaultPassword?: boolean
}

export interface DeserializedUserProfile
extends DeserializedUserDocument, MetaDocument<GeneralUserProfileMetaProperties> {}
