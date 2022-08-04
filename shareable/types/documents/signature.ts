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

export interface DeserializedSignatureResource extends DeserializedResource<
	SignatureResourceIdentifier,
	SignatureAttributes
> {}

export interface SignatureDocument<T = Buffer> extends ResourceDocument<
	SignatureResourceIdentifier,
	SignatureAttributes<T>,
	SignatureResource<T>
> {}

export interface SignatureListDocument extends ResourceListDocument<
	SignatureResourceIdentifier,
	SignatureAttributes,
	SignatureResource
> {}

export interface DeserializedSignatureDocument extends DeserializedResourceDocument<
	SignatureResourceIdentifier,
	SignatureAttributes,
	DeserializedSignatureResource
> {}

export interface DeserializedSignatureListDocument extends DeserializedResourceListDocument<
	SignatureResourceIdentifier,
	SignatureAttributes,
	DeserializedSignatureResource
> {}
