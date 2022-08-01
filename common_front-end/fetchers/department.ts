import type { Serializable } from "$/types/general"
import type { CommonQueryParameters } from "$/types/query"
import type {
	DepartmentResourceIdentifier,
	DepartmentAttributes,
	DepartmentResource,
	DeserializedDepartmentResource,
	DepartmentDocument,
	DepartmentListDocument,
	DeserializedDepartmentDocument,
	DeserializedDepartmentListDocument
} from "$/types/documents/department"
import Fetcher from "$@/fetchers/fetcher"

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
	CommonQueryParameters
> {
	static initialize(basePath: string) {
		super.initialize(basePath, "department")
	}

	constructor() {
		super(DepartmentFetcher.basePath, DepartmentFetcher.type)
	}
}
