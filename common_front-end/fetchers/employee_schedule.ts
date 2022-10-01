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

import { EMPLOYEE_SCHEDULE_LINK } from "$/constants/template_links"

export default class EmployeeScheduleFetcher extends BaseFetcher<
	EmployeeScheduleResourceIdentifier,
	EmployeeScheduleAttributes<"serialized">,
	EmployeeScheduleAttributes<"deserialized">,
	EmployeeScheduleResource,
	DeserializedEmployeeScheduleResource,
	EmployeeScheduleDocument,
	EmployeeScheduleListDocument,
	DeserializedEmployeeScheduleDocument,
	DeserializedEmployeeScheduleListDocument,
	{
		"queryParameters": EmployeeScheduleQueryParameters,
		"extraCreateData": EmployeeScheduleRelationships<"create">
	}
> {
	constructor() {
		super(EMPLOYEE_SCHEDULE_LINK)
	}
}
