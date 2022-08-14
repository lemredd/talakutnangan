import type { Day } from "$/types/database"
import type { UserResourceIdentifier } from "$/types/documents/user"
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

export interface EmployeeScheduleResourceIdentifier<T extends string|number = string>
extends ResourceIdentifier<T> {
	type: "employee_schedule"
}

export interface EmployeeScheduleAttributes<T extends number|undefined = undefined>
extends Attributes {
	userID: T,
	scheduleStart: number,
	scheduleEnd: number,
	dayName: Day
}

export interface EmployeeScheduleResource<T extends number|undefined = undefined> extends Resource<
	EmployeeScheduleResourceIdentifier,
	EmployeeScheduleAttributes<T>
> {
	relationships: T extends number ? undefined : {
		user: {
			data: UserResourceIdentifier
		}
	}
}

export type DeserializedEmployeeScheduleResource<T extends string|number = string>
= DeserializedResource<
	T,
	EmployeeScheduleResourceIdentifier<T>,
	EmployeeScheduleAttributes
>

export type EmployeeScheduleDocument<T extends number|undefined = undefined> = ResourceDocument<
	EmployeeScheduleResourceIdentifier,
	EmployeeScheduleAttributes<T>,
	EmployeeScheduleResource<T>
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
