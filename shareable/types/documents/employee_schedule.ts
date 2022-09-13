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
	DeserializedResourceListDocument,

	IdentifierDocument,
	IdentifierListDocument
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

export type EmployeeScheduleResource<T extends Completeness = "read", > = Resource<
	T,
	EmployeeScheduleResourceIdentifier<T>,
	EmployeeScheduleAttributes<"serialized">
> & (
	T extends "create" ? EmployeeScheduleRelationships : Serializable
)

export type DeserializedEmployeeScheduleResource = DeserializedResource<
	EmployeeScheduleResourceIdentifier<"read">,
	EmployeeScheduleAttributes<"deserialized">
>

export type EmployeeScheduleDocument<T extends Completeness = "read"> = ResourceDocument<
	T,
	EmployeeScheduleResourceIdentifier<T>,
	EmployeeScheduleAttributes<"serialized">,
	EmployeeScheduleResource<T>
>

export type EmployeeScheduleListDocument<T extends Completeness = "read"> = ResourceListDocument<
	T,
	EmployeeScheduleResourceIdentifier<T>,
	EmployeeScheduleAttributes<"serialized">,
	EmployeeScheduleResource<T>
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

export type EmployeeScheduleIdentifierDocument
= IdentifierDocument<EmployeeScheduleResourceIdentifier<"read">>

export type EmployeeScheduleIdentifierListDocument
= IdentifierListDocument<EmployeeScheduleResourceIdentifier<"read">>
