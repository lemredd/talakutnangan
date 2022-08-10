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
	type: "department",
	meta?: {
		userCount: number
	}
}

export interface DepartmentAttributes extends Attributes {
	fullName: string,
	acronym: string,
	mayAdmit: boolean
}

export type DepartmentResource = Resource<
	DepartmentResourceIdentifier,
	DepartmentAttributes
>

export type DeserializedDepartmentResource = DeserializedResource<
	DepartmentResourceIdentifier,
	DepartmentAttributes
>

export type DepartmentDocument = ResourceDocument<
	DepartmentResourceIdentifier,
	DepartmentAttributes,
	DepartmentResource
>

export type DepartmentListDocument = ResourceListDocument<
	DepartmentResourceIdentifier,
	DepartmentAttributes,
	DepartmentResource
>

export type DeserializedDepartmentDocument = DeserializedResourceDocument<
	DepartmentResourceIdentifier,
	DepartmentAttributes,
	DeserializedDepartmentResource
>

export type DeserializedDepartmentListDocument = DeserializedResourceListDocument<
	DepartmentResourceIdentifier,
	DepartmentAttributes,
	DeserializedDepartmentResource
>
