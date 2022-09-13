import type { Day } from "$/types/database"
import type { Serializable } from "$/types/general"
import type { UserIdentifierDocument, DeserializedUserDocument } from "$/types/documents/user"
import type {
	Completeness,
	Format,

	Resource,
	Attributes,
	ResourceIdentifier,
	DeserializedResource,

	DeriveRelationships,
	DeriveRelationshipNames,
	GeneralRelationshipData,
	DeriveDeserializedRelationships,
	PartialOrPickDeserializedRelationship,

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

interface EmployeeScheduleRelationshipData<unusedT extends Completeness = "read">
extends GeneralRelationshipData {
	user: {
		serialized: UserIdentifierDocument,
		deserialized: DeserializedUserDocument
	}
}

export type EmployeeScheduleRelationshipNames
= DeriveRelationshipNames<EmployeeScheduleRelationshipData>

export type EmployeeScheduleRelationships<T extends Completeness = "read">
= DeriveRelationships<EmployeeScheduleRelationshipData<T>>

export type DeserializedEmployeeScheduleRelationships<T extends Completeness = "read">
= DeriveDeserializedRelationships<EmployeeScheduleRelationshipData<T>>

export type EmployeeScheduleResource<T extends Completeness = "read", > = Resource<
	T,
	EmployeeScheduleResourceIdentifier<T>,
	EmployeeScheduleAttributes<"serialized">
> & (
	T extends "create" ? EmployeeScheduleRelationships : Serializable
)

export type DeserializedEmployeeScheduleResource<
	T extends EmployeeScheduleRelationshipNames|undefined = undefined
> = DeserializedResource<
	EmployeeScheduleResourceIdentifier<"read">,
	EmployeeScheduleAttributes<"deserialized">
> & PartialOrPickDeserializedRelationship<
	EmployeeScheduleRelationshipData<"read">,
	DeserializedEmployeeScheduleRelationships<"read">,
	EmployeeScheduleRelationshipNames,
	T extends EmployeeScheduleRelationshipNames ? true : false,
	T extends EmployeeScheduleRelationshipNames ? T : EmployeeScheduleRelationshipNames
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

export type DeserializedEmployeeScheduleDocument<
	T extends EmployeeScheduleRelationshipNames|undefined = undefined
> = DeserializedResourceDocument<
	EmployeeScheduleResourceIdentifier<"read">,
	EmployeeScheduleAttributes<"deserialized">,
	DeserializedEmployeeScheduleResource<T>
>

export type DeserializedEmployeeScheduleListDocument<
	T extends EmployeeScheduleRelationshipNames|undefined = undefined
> = DeserializedResourceListDocument<
	EmployeeScheduleResourceIdentifier<"read">,
	EmployeeScheduleAttributes<"deserialized">,
	DeserializedEmployeeScheduleResource<T>
>

export type EmployeeScheduleIdentifierDocument
= IdentifierDocument<EmployeeScheduleResourceIdentifier<"read">>

export type EmployeeScheduleIdentifierListDocument
= IdentifierListDocument<EmployeeScheduleResourceIdentifier<"read">>
