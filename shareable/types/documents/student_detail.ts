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

export interface StudentDetailResourceIdentifier<T extends string|number = string>
extends ResourceIdentifier<T> {
	type: "student_detail"
}

export interface StudentDetailAttributes extends Attributes {
	studentNumber: string
}

export type StudentDetailResource = Resource<
	StudentDetailResourceIdentifier,
	StudentDetailAttributes
>

export type DeserializedStudentDetailResource<T extends string|number = string>
= DeserializedResource<
	T,
	StudentDetailResourceIdentifier<T>,
	StudentDetailAttributes
>

export type StudentDetailDocument = ResourceDocument<
	StudentDetailResourceIdentifier,
	StudentDetailAttributes,
	StudentDetailResource
>

export type StudentDetailListDocument = ResourceListDocument<
	StudentDetailResourceIdentifier,
	StudentDetailAttributes,
	StudentDetailResource
>

export type DeserializedStudentDetailDocument<T extends string|number = string>
= DeserializedResourceDocument<
	T,
	StudentDetailResourceIdentifier<T>,
	StudentDetailAttributes,
	DeserializedStudentDetailResource<T>
>

export type DeserializedStudentDetailListDocument<T extends string|number = string>
= DeserializedResourceListDocument<
	T,
	StudentDetailResourceIdentifier<T>,
	StudentDetailAttributes,
	DeserializedStudentDetailResource<T>
>
