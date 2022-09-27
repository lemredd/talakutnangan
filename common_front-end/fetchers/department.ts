import type { Response } from "$@/types/independent"
import type { DepartmentQueryParameters } from "$/types/query"
import type {
	DepartmentResourceIdentifier,
	DepartmentAttributes,
	DepartmentResource,
	DeserializedDepartmentResource,
	DepartmentDocument,
	DepartmentListDocument,
	DeserializedDepartmentDocument,
	DeserializedDepartmentListDocument,
	DepartmentIdentifierListDocument
} from "$/types/documents/department"
import BaseFetcher from "$@/fetchers/base"
import stringifyQuery from "$@/fetchers/stringify_query"

export default class DepartmentFetcher extends BaseFetcher<
	DepartmentResourceIdentifier,
	DepartmentAttributes<"serialized">,
	DepartmentAttributes<"deserialized">,
	DepartmentResource,
	DeserializedDepartmentResource,
	DepartmentDocument,
	DepartmentListDocument,
	DeserializedDepartmentDocument,
	DeserializedDepartmentListDocument,
	{
		"queryParameters": DepartmentQueryParameters
	}
> {
	static initialize(basePath: string) {
		super.initialize(basePath, "department")
	}

	constructor() {
		super(DepartmentFetcher.basePath, DepartmentFetcher.type)
	}

	countUsers(IDs: string[]): Promise<Response<
		DepartmentResourceIdentifier,
		DepartmentAttributes<"serialized">,
		DepartmentAttributes<"deserialized">,
		DepartmentResource,
		DeserializedDepartmentResource,
		DepartmentIdentifierListDocument<"read">
	>> {
		return this.handleResponse(
			this.getJSON(
				`${this.type}/count_users?${stringifyQuery({
					"filter": {
						IDs
					}
				})}`
			),
			false
		) as Promise<Response<
			DepartmentResourceIdentifier,
			DepartmentAttributes<"serialized">,
			DepartmentAttributes<"deserialized">,
			DepartmentResource,
			DeserializedDepartmentResource,
			DepartmentIdentifierListDocument<"read">
		>>
	}
}
