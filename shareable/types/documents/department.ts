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

export interface DepartmentDocument extends ResourceDocument<
	DepartmentResourceIdentifier,
	DepartmentAttributes,
	DepartmentResource
> {}

export interface DepartmentListDocument extends ResourceListDocument<
	DepartmentResourceIdentifier,
	DepartmentAttributes,
	DepartmentResource
> {}

export interface DeserializedDepartmentDocument extends DeserializedResourceDocument<
	DepartmentResourceIdentifier,
	DepartmentAttributes,
	DeserializedDepartmentResource
> {}

export interface DeserializedDepartmentListDocument extends DeserializedResourceListDocument<
	DepartmentResourceIdentifier,
	DepartmentAttributes,
	DeserializedDepartmentResource
> {}