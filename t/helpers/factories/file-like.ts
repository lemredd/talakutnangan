import type { Model } from "%/types/dependent"
import type { FileLikeTransformerOptions } from "%/types/independent"
import type {
	ResourceIdentifier,
	Attributes,
	DeserializedResource,
	DeserializedResourceDocument,
	DeserializedResourceListDocument
} from "$/types/documents/base"

import dataURIToBuffer from "data-uri-to-buffer"
import type { MimeBuffer } from "data-uri-to-buffer"
import { faker } from "@faker-js/faker"

import BaseFactory from "~/factories/base"

export default abstract class FileLikeFactory<
	T extends Model,
	U extends ResourceIdentifier,
	V extends Attributes,
	W extends DeserializedResource<U, V>,
	X extends DeserializedResourceDocument<U, V, W>,
	Y extends DeserializedResourceListDocument<U, V, W>,
	Z extends FileLikeTransformerOptions = FileLikeTransformerOptions
> extends BaseFactory<T, U, V, W, X, Y, Z> {
	protected fileContentsGenerator: () => MimeBuffer = () => dataURIToBuffer(
		faker.image.dataUri()
	)

	fileContents(generator: () => MimeBuffer): FileLikeFactory<T, U, V, W, X, Y, Z> {
		this.fileContentsGenerator = generator
		return this
	}
}
