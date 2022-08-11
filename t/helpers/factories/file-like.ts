import type { Model } from "%/types/dependent"
import type { FileLikeTransformerOptions } from "%/types/independent"
import type {
	ResourceIdentifier,
	Attributes,
	DeserializedResource,
	DeserializedResourceDocument,
	DeserializedResourceListDocument,
Resource,
ResourceDocument,
ResourceListDocument
} from "$/types/documents/base"

import dataURIToBuffer from "data-uri-to-buffer"
import type { MimeBuffer } from "data-uri-to-buffer"
import { faker } from "@faker-js/faker"

import BaseFactory from "~/factories/base"

export default abstract class FileLikeFactory<
	T extends Model,
	U extends ResourceIdentifier,
	V extends Attributes,
	W extends Resource<U, V>,
	X extends DeserializedResource<U, V>,
	Y extends ResourceDocument<U, V, W>,
	Z extends ResourceListDocument<U, V, W>,
	A extends DeserializedResourceDocument<U, V, X>,
	B extends DeserializedResourceListDocument<U, V, X>,
	C extends FileLikeTransformerOptions = FileLikeTransformerOptions
> extends BaseFactory<T, U, V, W, X, Y, Z, A, B, C> {
	protected fileContentsGenerator: () => MimeBuffer = () => dataURIToBuffer(
		faker.image.dataUri()
	)

	fileContents(generator: () => MimeBuffer): FileLikeFactory<T, U, V, W, X, Y, Z, A, B, C> {
		this.fileContentsGenerator = generator
		return this
	}
}