import type {
	Completeness,
	Format,

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

export interface StudentDetailResourceIdentifier<T extends Completeness = "read">
extends ResourceIdentifier<T> {
	type: "student_detail"
}

export interface StudentDetailAttributes<T extends Format = "serialized"> extends Attributes<T> {
	studentNumber: string
}

export type StudentDetailResource<T extends Completeness = "read"> = Resource<
	T,
	StudentDetailResourceIdentifier<T>,
	StudentDetailAttributes<"serialized">
>

export type DeserializedStudentDetailResource = DeserializedResource<
	StudentDetailResourceIdentifier<"read">,
	StudentDetailAttributes
>

export type StudentDetailDocument<T extends Completeness = "read"> = ResourceDocument<
	T,
	StudentDetailResourceIdentifier<T>,
	StudentDetailAttributes<"serialized">,
	StudentDetailResource<T>
>

export type StudentDetailListDocument<T extends Completeness = "read"> = ResourceListDocument<
	T,
	StudentDetailResourceIdentifier<T>,
	StudentDetailAttributes<"serialized">,
	StudentDetailResource<T>
>

export type DeserializedStudentDetailDocument = DeserializedResourceDocument<
	StudentDetailResourceIdentifier<"read">,
	StudentDetailAttributes<"deserialized">,
	DeserializedStudentDetailResource
>

export type DeserializedStudentDetailListDocument = DeserializedResourceListDocument<
	StudentDetailResourceIdentifier<"read">,
	StudentDetailAttributes<"deserialized">,
	DeserializedStudentDetailResource
>

export type StudentDetailIdentifierDocument
= IdentifierDocument<StudentDetailResourceIdentifier<"read">>

export type StudentDetailIdentifierListDocument
= IdentifierListDocument<StudentDetailResourceIdentifier<"read">>
