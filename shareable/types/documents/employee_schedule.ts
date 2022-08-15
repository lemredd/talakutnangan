import type { Day } from "$/types/database"
import type { UserResourceIdentifier } from "$/types/documents/user"
import type {
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

export type EmployeeScheduleRelationships<
	T extends boolean = false,
	U extends number|string = string
>
= Relationships<T, [ [ "user", UserResourceIdentifier<U> ] ]>

/**
 * Shape of employee schedule resource.
 *
 * If first generic argument is number or false, second generic argument is unnecessary and `userID`
 * will be one of the attributes. Otherwise, relationships will be included.
 *
 * Second generic argument dictates the type of primary ID for user resource identifier.
 */
export interface EmployeeScheduleResource<
	T extends number|boolean = false,
	U extends string|number = string,
> extends Resource<
	EmployeeScheduleResourceIdentifier,
	EmployeeScheduleAttributes<T extends number ? number : undefined>
>, EmployeeScheduleRelationships<T extends number ? false : T, U> {}

export type DeserializedEmployeeScheduleResource<T extends string|number = string>
= DeserializedResource<
	T,
	EmployeeScheduleResourceIdentifier<T>,
	EmployeeScheduleAttributes
>

export type EmployeeScheduleDocument<
	T extends number|boolean = false,
	U extends string|number = string
> = ResourceDocument<
	EmployeeScheduleResourceIdentifier,
	EmployeeScheduleAttributes<T extends number ? number : undefined>,
	EmployeeScheduleResource<T, U>
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
