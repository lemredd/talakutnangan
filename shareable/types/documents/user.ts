import type { Serializable } from "$/types/general"
import type { SummedTimeDocument } from "$/types/documents/consolidated_time"
import type {
	RoleIdentifierListDocument,
	DeserializedRoleListDocument
} from "$/types/documents/role"
import type {
	SignatureIdentifierDocument,
	DeserializedSignatureDocument
} from "$/types/documents/signature"
import type {
	DepartmentIdentifierDocument,
	DeserializedDepartmentDocument
} from "$/types/documents/department"
import type {
	StudentDetailIdentifierDocument,
	DeserializedStudentDetailDocument
} from "$/types/documents/student_detail"
import type {
	ProfilePictureIdentifierDocument,
	DeserializedProfilePictureDocument
} from "$/types/documents/profile_picture"
import type {
	EmployeeScheduleIdentifierListDocument,
	DeserializedEmployeeScheduleListDocument
} from "$/types/documents/employee_schedule"
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

	DeriveRelationships,
	DeriveRelationshipNames,
	GeneralRelationshipData,
	DeriveDeserializedRelationships,
	PartialOrPickDeserializedRelationship,

	IdentifierDocument,
	IdentifierListDocument
} from "$/types/documents/base"

interface UserRelationshipData<T extends Completeness = "read">
extends GeneralRelationshipData {
	department: {
		serialized: DepartmentIdentifierDocument<T extends "create"|"update" ? "attached" : T>,
		deserialized: DeserializedDepartmentDocument<"attached">
	},
	roles: {
		serialized: RoleIdentifierListDocument<T extends "create"|"update" ? "attached" : T>,
		deserialized: DeserializedRoleListDocument<"attached">
	},
	profilePicture: {
		serialized: ProfilePictureIdentifierDocument,
		deserialized: DeserializedProfilePictureDocument
	},
	signature: {
		serialized: SignatureIdentifierDocument,
		deserialized: DeserializedSignatureDocument
	},
	studentDetail: {
		serialized: StudentDetailIdentifierDocument,
		deserialized: DeserializedStudentDetailDocument
	},
	employeeSchedule: {
		serialized: EmployeeScheduleIdentifierListDocument,
		deserialized: DeserializedEmployeeScheduleListDocument
	}
}

export type UserRelationshipNames = DeriveRelationshipNames<UserRelationshipData>

export type UserRelationships<T extends Completeness = "read">
= DeriveRelationships<UserRelationshipData<T>>

export type DeserializedUserRelationships<T extends Completeness = "read">
= DeriveDeserializedRelationships<UserRelationshipData<T>>

export interface UserResourceIdentifier<T extends Completeness = "read">
extends ResourceIdentifier<T> {
	type: "user"
}

interface GeneralUserAttributes<T extends Format = "serialized"> extends Attributes<T> {
	name: string,
	email: string,
	emailVerifiedAt: (T extends "serialized" ? string : Date)|null,
	prefersDark: boolean,
	deletedAt: (T extends "serialized" ? string : Date)|null
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

type DeserializedGeneralUserAttributes = GeneralUserAttributes<"deserialized">

interface DeserializedStudentAttributes
extends DeserializedGeneralUserAttributes, StudentAttributes<"deserialized"> {}

interface DeserializedReachableEmployeesAttributes
extends DeserializedGeneralUserAttributes, ReachableEmployeesAttributes<"deserialized"> {}

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

export type DeserializedStudentResource = DeserializedResource<
	UserResourceIdentifier<"read">,
	DeserializedStudentAttributes
>

export type DeserializedReachableEmployeesResource = DeserializedResource<
	UserResourceIdentifier<"read">,
	DeserializedReachableEmployeesAttributes
>

export type DeserializedUnreachableEmployeesResource = DeserializedResource<
	UserResourceIdentifier<"read">,
	DeserializedUnreachableEmployeesAttributes
>

export type DeserializedUserResource<
	T extends UserRelationshipNames|undefined = undefined
> = (
	| DeserializedStudentResource
	| DeserializedReachableEmployeesResource
	| DeserializedUnreachableEmployeesResource
) & PartialOrPickDeserializedRelationship<
	UserRelationshipData<"read">,
	DeserializedUserRelationships<"read">,
	UserRelationshipNames,
	T extends UserRelationshipNames ? true : false,
	T extends UserRelationshipNames ? T : UserRelationshipNames
>

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

export type DeserializedUserDocument<
	T extends UserRelationshipNames|undefined = undefined
> = DeserializedResourceDocument<
	UserResourceIdentifier<"read">,
	DeserializedUserAttributes,
	DeserializedUserResource<T>
>

export type DeserializedUserListDocument<
	T extends UserRelationshipNames|undefined = undefined
> = DeserializedResourceListDocument<
	UserResourceIdentifier<"read">,
	DeserializedUserAttributes,
	DeserializedUserResource<T>
>

interface GeneralUserProfileMetaProperties extends Serializable {
	hasDefaultPassword?: boolean
}

export type DeserializedUserProfile<
	T extends UserRelationshipNames|undefined = undefined
> = DeserializedUserDocument<T> & MetaDocument<GeneralUserProfileMetaProperties>

export type UserIdentifierDocument
= IdentifierDocument<UserResourceIdentifier<"read">>

export type UserIdentifierListDocument
= IdentifierListDocument<UserResourceIdentifier<"read">>

export type DeserializedUserListWithTimeConsumedDocument = DeserializedResourceListDocument<
	UserResourceIdentifier<"read">,
	DeserializedUserAttributes,
	DeserializedUserResource<T> & SummedTimeDocument
>
