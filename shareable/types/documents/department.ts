import type {
	Resource,
	Attributes,
	ResourceIdentifier,
	DeserializedResource,
	CompleteDataDocument,
	CompleteDataListDocument,
	DeserializedCompleteDataDocument,
	DeserializedCompleteDataListDocument
} from "$/types/documents/base"

export interface DepartmentResourceIdentifier extends ResourceIdentifier {
	type: "department"
}

export interface DepartmentAttributes extends Attributes {
	fullName: string,
	acronym: string,
	mayAdmit: boolean
}

export interface DepartmentResource extends Resource<
	DepartmentResourceIdentifier,
	DepartmentAttributes
> {}

export interface DeserializedDepartmentResource extends DeserializedResource<
	DepartmentResourceIdentifier,
	DepartmentAttributes
> {}

export interface CompleteDepartmentDataDocument extends CompleteDataDocument<
	DepartmentResourceIdentifier,
	DepartmentAttributes,
	DepartmentResource
> {}

export interface CompleteDepartmentDataListDocument extends CompleteDataListDocument<
	DepartmentResourceIdentifier,
	DepartmentAttributes,
	DepartmentResource
> {}

export interface DeserializedCompleteDepartmentDataDocument extends DeserializedCompleteDataDocument<
	DepartmentResourceIdentifier,
	DepartmentAttributes,
	DeserializedDepartmentResource
> {}

export interface DeserializedCompleteDepartmentDataListDocument
extends DeserializedCompleteDataListDocument<
	DepartmentResourceIdentifier,
	DepartmentAttributes,
	DeserializedDepartmentResource
> {}
