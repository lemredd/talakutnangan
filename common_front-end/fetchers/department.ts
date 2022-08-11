import type { Serializable } from "$/types/general"
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

import Fetcher from "$@/fetchers/fetcher"
import stringifyQuery from "$@/fetchers/stringify_query"

export default class DepartmentFetcher extends Fetcher<
	DepartmentResourceIdentifier,
	DepartmentAttributes,
	DepartmentResource,
	DeserializedDepartmentResource,
	DepartmentDocument,
	DepartmentListDocument,
	DeserializedDepartmentDocument,
	DeserializedDepartmentListDocument,
	Serializable,
	DepartmentQueryParameters
> {
	static initialize(basePath: string) {
		super.initialize(basePath, "department")
	}

	constructor() {
		super(DepartmentFetcher.basePath, DepartmentFetcher.type)
	}

	countUsers(IDs: number[]): Promise<Response<
		DepartmentResourceIdentifier,
		DepartmentAttributes,
		DepartmentResource,
		DeserializedDepartmentResource,
		DepartmentIdentifierListDocument
	>> {
		return this.handleResponse(
			this.getJSON(
				`${this.type}/count_users?${stringifyQuery({
					filter: {
						IDs
					}
				})}`
			),
			false
		) as Promise<Response<
			DepartmentResourceIdentifier,
			DepartmentAttributes,
			DepartmentResource,
			DeserializedDepartmentResource,
			DepartmentIdentifierListDocument
		>>
	}
}
