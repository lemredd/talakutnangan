import type { RequirePassword } from "$/types/documents/security"
import type {
	Resource,
	Attributes,
	ResourceIdentifier,
	DeserializedResource,
	ResourceDocument,
	ResourceListDocument,
	DeserializedResourceDocument,
	DeserializedResourceListDocument,
	IdentifierDocument,
	IdentifierListDocument
} from "$/types/documents/base"

export interface DepartmentResourceIdentifier<T extends string|number = string>
extends ResourceIdentifier<T> {
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

export type DeserializedDepartmentResource<T extends string|number = string> = DeserializedResource<
	T,
	DepartmentResourceIdentifier<T>,
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

export type DeserializedDepartmentDocument<T extends string|number = string>
= DeserializedResourceDocument<
	T,
	DepartmentResourceIdentifier<T>,
	DepartmentAttributes,
	DeserializedDepartmentResource<T>
>

export type DeserializedDepartmentListDocument<T extends string|number = string>
= DeserializedResourceListDocument<
	T,
	DepartmentResourceIdentifier<T>,
	DepartmentAttributes,
	DeserializedDepartmentResource<T>
>

export type DepartmentIdentifierDocument = IdentifierDocument<DepartmentResourceIdentifier>

export type DepartmentIdentifierListDocument = IdentifierListDocument<DepartmentResourceIdentifier>

export type UpdatedDepartmentDocument = DepartmentDocument & RequirePassword
