import type { FileLikeAttributes } from "$/types/documents/file-like"
import type { RawableFormat as Format } from "$/types/documents/irregularity"
import type {
	Completeness,
	Resource,

	ResourceIdentifier,
	DeserializedResource,

	ResourceDocument,
	ResourceListDocument,
	DeserializedResourceDocument,
	DeserializedResourceListDocument,

	IdentifierDocument,
	IdentifierListDocument
} from "$/types/documents/base"

export interface SignatureResourceIdentifier<T extends Completeness = "read">
extends ResourceIdentifier<T> {
	type: "signature"
}

export type SignatureAttributes<T extends Format = "serialized"> = FileLikeAttributes<T>

export type SignatureResource<
	T extends Completeness = "read",
	U extends Format = "serialized"
> = Resource<
	T,
	SignatureResourceIdentifier<T>,
	SignatureAttributes<U>
>

export type DeserializedSignatureResource<T extends Format = "serialized">
= DeserializedResource<
	SignatureResourceIdentifier<"read">,
	SignatureAttributes<T>
>

export type SignatureDocument<
	T extends Completeness = "read",
	U extends Format = "serialized"
> = ResourceDocument<
	T,
	SignatureResourceIdentifier<T>,
	SignatureAttributes<U>,
	SignatureResource<T, U>
>

export type SignatureListDocument<
	T extends Completeness = "read",
	U extends Format = "serialized"
> = ResourceListDocument<
	T,
	SignatureResourceIdentifier<T>,
	SignatureAttributes<U>,
	SignatureResource<T, U>
>

export type DeserializedSignatureDocument<T extends Format = "serialized">
= DeserializedResourceDocument<
	SignatureResourceIdentifier<"read">,
	SignatureAttributes<T>,
	DeserializedSignatureResource<T>
>

export type DeserializedSignatureListDocument<T extends Format = "serialized">
= DeserializedResourceListDocument<
	SignatureResourceIdentifier<"read">,
	SignatureAttributes<T>,
	DeserializedSignatureResource<T>
>

export type SignatureIdentifierDocument
= IdentifierDocument<SignatureResourceIdentifier<"read">>

export type SignatureIdentifierListDocument
= IdentifierListDocument<SignatureResourceIdentifier<"read">>
