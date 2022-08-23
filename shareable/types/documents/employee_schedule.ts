import type { Day } from "$/types/database"
import type { Serializable } from "$/types/general"
import type { UserIdentifierDocument } from "$/types/documents/user"
import type {
	Completeness,
	Format,
	Resource,
	Relationships,
	Attributes,
	ResourceIdentifier,
	DeserializedResource,
	ResourceDocument,
	ResourceListDocument,
	DeserializedResourceDocument,
	DeserializedResourceListDocument
} from "$/types/documents/base"

export interface EmployeeScheduleResourceIdentifier<T extends Completeness = "read">
extends ResourceIdentifier<T> {
	type: "employee_schedule"
}

export interface EmployeeScheduleAttributes<T extends Format = "serialized"> extends Attributes<T> {
	scheduleStart: number,
	scheduleEnd: number,
	dayName: Day
}

export type EmployeeScheduleRelationships = Relationships<{ "user": UserIdentifierDocument }>

/**
 * Shape of employee schedule resource.
 *
 * If first generic argument is number or false, second generic argument is unnecessary and `userID`
 * will be one of the attributes. Otherwise, relationships will be included.
 *
 * Second generic argument dictates the type of primary ID for user resource identifier.
 */
export type EmployeeScheduleResource<
	T extends Completeness = "read",
	U extends boolean = false,
> = Resource<
	T,
	EmployeeScheduleResourceIdentifier<T>,
	EmployeeScheduleAttributes<"serialized">
> & (
	U extends true ? EmployeeScheduleRelationships : Serializable
)

export type DeserializedEmployeeScheduleResource = DeserializedResource<
	EmployeeScheduleResourceIdentifier<"read">,
	EmployeeScheduleAttributes<"deserialized">
>

export type EmployeeScheduleDocument<
	T extends Completeness = "read",
	U extends boolean = false,
> = ResourceDocument<
	T,
	EmployeeScheduleResourceIdentifier<T>,
	EmployeeScheduleAttributes<"serialized">,
	EmployeeScheduleResource<T, U>
>

export type EmployeeScheduleListDocument<
	T extends Completeness = "read",
	U extends boolean = false,
> = ResourceListDocument<
	T,
	EmployeeScheduleResourceIdentifier<T>,
	EmployeeScheduleAttributes<"serialized">,
	EmployeeScheduleResource<T, U>
>

export type DeserializedEmployeeScheduleDocument = DeserializedResourceDocument<
	EmployeeScheduleResourceIdentifier<"read">,
	EmployeeScheduleAttributes<"deserialized">,
	DeserializedEmployeeScheduleResource
>

export type DeserializedEmployeeScheduleListDocument = DeserializedResourceListDocument<
	EmployeeScheduleResourceIdentifier<"read">,
	EmployeeScheduleAttributes<"deserialized">,
	DeserializedEmployeeScheduleResource
>
