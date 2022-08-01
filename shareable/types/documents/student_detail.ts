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

export interface StudentDetailResource extends Resource<
	StudentDetailResourceIdentifier,
	StudentDetailAttributes
> {}

export interface DeserializedStudentDetailResource extends DeserializedResource<
	StudentDetailResourceIdentifier,
	StudentDetailAttributes
> {}

export interface StudentDetailDocument extends ResourceDocument<
	StudentDetailResourceIdentifier,
	StudentDetailAttributes,
	StudentDetailResource
> {}

export interface StudentDetailListDocument extends ResourceListDocument<
	StudentDetailResourceIdentifier,
	StudentDetailAttributes,
	StudentDetailResource
> {}

export interface DeserializedStudentDetailDocument extends DeserializedResourceDocument<
	StudentDetailResourceIdentifier,
	StudentDetailAttributes,
	DeserializedStudentDetailResource
> {}

export interface DeserializedStudentDetailListDocument extends DeserializedResourceListDocument<
	StudentDetailResourceIdentifier,
	StudentDetailAttributes,
	DeserializedStudentDetailResource
> {}
