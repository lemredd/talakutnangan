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

export interface FileLikeResourceIdentifier extends ResourceIdentifier {}

export interface FileLikeAttributes<T = string> extends Attributes {
	file?: T
}

export interface FileLikeResource<T = string> extends Resource<
	FileLikeResourceIdentifier,
	FileLikeAttributes<T>
> {
	links?: {
		self: string
	}
}

export interface DeserializedFileLikeResource extends DeserializedResource<
	FileLikeResourceIdentifier,
	FileLikeAttributes
> {}

export interface FileLikeDocument<T = Buffer> extends ResourceDocument<
	FileLikeResourceIdentifier,
	FileLikeAttributes<T>,
	FileLikeResource<T>
> {}

export interface FileLikeListDocument extends ResourceListDocument<
	FileLikeResourceIdentifier,
	FileLikeAttributes,
	FileLikeResource
> {}

export interface DeserializedFileLikeDocument extends DeserializedResourceDocument<
	FileLikeResourceIdentifier,
	FileLikeAttributes,
	DeserializedFileLikeResource
> {}

export interface DeserializedFileLikeListDocument extends DeserializedResourceListDocument<
	FileLikeResourceIdentifier,
	FileLikeAttributes,
	DeserializedFileLikeResource
> {}
