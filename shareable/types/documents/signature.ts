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

export interface SignatureResourceIdentifier extends ResourceIdentifier {
	type: "signature",
}

export interface SignatureAttributes<T = string> extends Attributes {
	signature?: T
}

export interface SignatureResource<T = string> extends Resource<
	SignatureResourceIdentifier,
	SignatureAttributes<T>
> {
	links?: {
		self: string
	}
}

export type DeserializedSignatureResource = DeserializedResource<
	SignatureResourceIdentifier,
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

export type DeserializedSignatureDocument = DeserializedResourceDocument<
	SignatureResourceIdentifier,
	SignatureAttributes,
	DeserializedSignatureResource
>

export type DeserializedSignatureListDocument = DeserializedResourceListDocument<
	SignatureResourceIdentifier,
	SignatureAttributes,
	DeserializedSignatureResource
>
