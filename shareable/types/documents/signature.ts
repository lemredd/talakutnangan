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

export interface SignatureAttributes extends Attributes {
	signature?: string
}

export interface SignatureResource extends Resource<
	SignatureResourceIdentifier,
	SignatureAttributes
> {
	links: {
		self: string
	}
}

export interface DeserializedSignatureResource extends DeserializedResource<
	SignatureResourceIdentifier,
	SignatureAttributes
> {}

export interface SignatureDocument extends ResourceDocument<
	SignatureResourceIdentifier,
	SignatureAttributes,
	SignatureResource
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
