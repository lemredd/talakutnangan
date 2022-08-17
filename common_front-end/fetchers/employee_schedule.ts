import type { Serializable } from "$/types/general"
import type { EmployeeScheduleQueryParameters } from "$/types/query"
import type {
	EmployeeScheduleResourceIdentifier,
	EmployeeScheduleAttributes,
	EmployeeScheduleResource,
	DeserializedEmployeeScheduleResource,
	EmployeeScheduleDocument,
	EmployeeScheduleListDocument,
	DeserializedEmployeeScheduleDocument,
	DeserializedEmployeeScheduleListDocument,
	EmployeeScheduleRelationships
} from "$/types/documents/employee_schedule"
import BaseFetcher from "$@/fetchers/base"

export default class EmployeeScheduleFetcher extends BaseFetcher<
	EmployeeScheduleResourceIdentifier,
	EmployeeScheduleAttributes,
	EmployeeScheduleResource,
	DeserializedEmployeeScheduleResource,
	EmployeeScheduleDocument,
	EmployeeScheduleListDocument,
	DeserializedEmployeeScheduleDocument,
	DeserializedEmployeeScheduleListDocument,
	Serializable,
	EmployeeScheduleQueryParameters,
	EmployeeScheduleRelationships<true>
> {
	static initialize(basePath: string) {
		super.initialize(basePath, "employee_schedule")
	}

	constructor() {
		super(EmployeeScheduleFetcher.basePath, EmployeeScheduleFetcher.type)
	}
}
