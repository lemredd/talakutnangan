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
import BaseFetcher from "$@/fetchers/base"

export default class DepartmentFetcher extends BaseFetcher<
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
