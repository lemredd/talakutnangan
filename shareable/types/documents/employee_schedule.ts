import type {
	Resource,
	Attributes,
	ResourceIdentifier,
	DeserializedResource,
	ResourceDocument,
	ResourceListDocument,
	DeserializedResourceDocument,
	DeserializedResourceListDocument
} from "$/types/documents/base"
import type { Day } from "$/types/database"

export interface EmployeeScheduleResourceIdentifier<T extends string|number = string>
extends ResourceIdentifier<T> {
	type: "employee_schedule"
}

export interface EmployeeScheduleAttributes extends Attributes {
	scheduleStart: number,
	scheduleEnd: number,
	dayName: Day
}

export type EmployeeScheduleResource = Resource<
	EmployeeScheduleResourceIdentifier,
	EmployeeScheduleAttributes
>

export type DeserializedEmployeeScheduleResource<T extends string|number = string>
= DeserializedResource<
	T,
	EmployeeScheduleResourceIdentifier<T>,
	EmployeeScheduleAttributes
>

export type EmployeeScheduleDocument = ResourceDocument<
	EmployeeScheduleResourceIdentifier,
	EmployeeScheduleAttributes,
	EmployeeScheduleResource
>

export type EmployeeScheduleListDocument = ResourceListDocument<
	EmployeeScheduleResourceIdentifier,
	EmployeeScheduleAttributes,
	EmployeeScheduleResource
>

export type DeserializedEmployeeScheduleDocument<T extends string|number = string>
= DeserializedResourceDocument<
	T,
	EmployeeScheduleResourceIdentifier<T>,
	EmployeeScheduleAttributes,
	DeserializedEmployeeScheduleResource<T>
>

export type DeserializedEmployeeScheduleListDocument<T extends string|number = string>
= DeserializedResourceListDocument<
	T,
	EmployeeScheduleResourceIdentifier<T>,
	EmployeeScheduleAttributes,
	DeserializedEmployeeScheduleResource<T>
>
