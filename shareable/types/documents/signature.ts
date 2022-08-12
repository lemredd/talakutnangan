import type { FileLikeAttributes, FileLikeResourceLinks } from "$/types/documents/file-like"
import type {
	Resource,
	ResourceIdentifier,
	DeserializedResource,
	ResourceDocument,
	ResourceListDocument,
	DeserializedResourceDocument,
	DeserializedResourceListDocument
} from "$/types/documents/base"

export interface SignatureResourceIdentifier<T extends string|number = string>
extends ResourceIdentifier<T> {
	type: "signature",
}

export type SignatureAttributes<T = string> = FileLikeAttributes<T>

export interface SignatureResource<T = string> extends Resource<
	SignatureResourceIdentifier,
	SignatureAttributes<T>
>, FileLikeResourceLinks {}

export type DeserializedSignatureResource<T extends string|number = string>
= DeserializedResource<
	T,
	SignatureResourceIdentifier<T>,
	SignatureAttributes
>


export type SignatureDocument<T = Buffer> = ResourceDocument<
	SignatureResourceIdentifier,
	SignatureAttributes<T>,
	SignatureResource<T>
>

export type SignatureListDocument = ResourceListDocument<
	SignatureResourceIdentifier,
	SignatureAttributes,
	SignatureResource
>

export type DeserializedSignatureDocument<T extends string|number = string>
= DeserializedResourceDocument<
	T,
	SignatureResourceIdentifier<T>,
	SignatureAttributes,
	DeserializedSignatureResource<T>
>

export type DeserializedSignatureListDocument<T extends string|number = string>
= DeserializedResourceListDocument<
	T,
	SignatureResourceIdentifier<T>,
	SignatureAttributes,
	DeserializedSignatureResource<T>
>
