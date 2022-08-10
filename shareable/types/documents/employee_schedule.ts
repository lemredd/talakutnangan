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

export interface EmployeeScheduleResourceIdentifier extends ResourceIdentifier {
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

export type DeserializedEmployeeScheduleResource = DeserializedResource<
	EmployeeScheduleResourceIdentifier,
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

export type DeserializedEmployeeScheduleDocument = DeserializedResourceDocument<
	EmployeeScheduleResourceIdentifier,
	EmployeeScheduleAttributes,
	DeserializedEmployeeScheduleResource
>

export type DeserializedEmployeeScheduleListDocument = DeserializedResourceListDocument<
	EmployeeScheduleResourceIdentifier,
	EmployeeScheduleAttributes,
	DeserializedEmployeeScheduleResource
>
