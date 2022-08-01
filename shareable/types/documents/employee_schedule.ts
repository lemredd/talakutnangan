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

export interface EmployeeScheduleResource extends Resource<
	EmployeeScheduleResourceIdentifier,
	EmployeeScheduleAttributes
> {}

export interface DeserializedEmployeeScheduleResource extends DeserializedResource<
	EmployeeScheduleResourceIdentifier,
	EmployeeScheduleAttributes
> {}

export interface EmployeeScheduleDocument extends ResourceDocument<
	EmployeeScheduleResourceIdentifier,
	EmployeeScheduleAttributes,
	EmployeeScheduleResource
> {}

export interface EmployeeScheduleListDocument extends ResourceListDocument<
	EmployeeScheduleResourceIdentifier,
	EmployeeScheduleAttributes,
	EmployeeScheduleResource
> {}

export interface DeserializedEmployeeScheduleDocument extends DeserializedResourceDocument<
	EmployeeScheduleResourceIdentifier,
	EmployeeScheduleAttributes,
	DeserializedEmployeeScheduleResource
> {}

export interface DeserializedEmployeeScheduleListDocument extends DeserializedResourceListDocument<
	EmployeeScheduleResourceIdentifier,
	EmployeeScheduleAttributes,
	DeserializedEmployeeScheduleResource
> {}
