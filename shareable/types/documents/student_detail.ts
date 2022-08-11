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

export interface StudentDetailResourceIdentifier extends ResourceIdentifier {
	type: "student_detail"
}

export interface StudentDetailAttributes extends Attributes {
	studentNumber: string
}

export type StudentDetailResource = Resource<
	StudentDetailResourceIdentifier,
	StudentDetailAttributes
>

export type DeserializedStudentDetailResource = DeserializedResource<
	StudentDetailResourceIdentifier,
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

export type DeserializedStudentDetailDocument = DeserializedResourceDocument<
	StudentDetailResourceIdentifier,
	StudentDetailAttributes,
	DeserializedStudentDetailResource
>

export type DeserializedStudentDetailListDocument = DeserializedResourceListDocument<
	StudentDetailResourceIdentifier,
	StudentDetailAttributes,
	DeserializedStudentDetailResource
>
