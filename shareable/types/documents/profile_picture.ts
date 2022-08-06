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

export interface ProfilePictureResourceIdentifier extends ResourceIdentifier {
	type: "profile_picture",
}

export interface ProfilePictureAttributes<T = string> extends Attributes {
	file?: T
}

export interface ProfilePictureResource<T = string> extends Resource<
	ProfilePictureResourceIdentifier,
	ProfilePictureAttributes<T>
> {
	links?: {
		self: string
	}
}

export interface DeserializedProfilePictureResource extends DeserializedResource<
	ProfilePictureResourceIdentifier,
	ProfilePictureAttributes
> {}

export interface ProfilePictureDocument<T = Buffer> extends ResourceDocument<
	ProfilePictureResourceIdentifier,
	ProfilePictureAttributes<T>,
	ProfilePictureResource<T>
> {}

export interface ProfilePictureListDocument extends ResourceListDocument<
	ProfilePictureResourceIdentifier,
	ProfilePictureAttributes,
	ProfilePictureResource
> {}

export interface DeserializedProfilePictureDocument extends DeserializedResourceDocument<
	ProfilePictureResourceIdentifier,
	ProfilePictureAttributes,
	DeserializedProfilePictureResource
> {}

export interface DeserializedProfilePictureListDocument extends DeserializedResourceListDocument<
	ProfilePictureResourceIdentifier,
	ProfilePictureAttributes,
	DeserializedProfilePictureResource
> {}
