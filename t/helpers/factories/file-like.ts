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

import { faker } from "@faker-js/faker"
import dataURIToBuffer, { MimeBuffer } from "data-uri-to-buffer"

import BaseFactory from "~/factories/base"

export default abstract class FileLikeFactory<
	T extends Model,
	U extends ResourceIdentifier<"read">,
	V extends Attributes<"serialized">,
	W extends Attributes<"deserialized">,
	X extends Resource<"read", U, V>,
	Y extends DeserializedResource<U, W>,
	Z extends ResourceDocument<"read", U, V, X>,
	A extends ResourceListDocument<"read", U, V, X>,
	B extends DeserializedResourceDocument<U, W, Y>,
	C extends DeserializedResourceListDocument<U, W, Y>,
	D extends FileLikeTransformerOptions = FileLikeTransformerOptions
> extends BaseFactory<T, U, V, W, X, Y, Z, A, B, C, D> {
	protected fileContentsGenerator: () => MimeBuffer|Buffer = () => dataURIToBuffer(
		faker.image.dataUri()
	)

	fileContents(generator: () => MimeBuffer|Buffer)
	: FileLikeFactory<T, U, V, W, X, Y, Z, A, B, C, D> {
		this.fileContentsGenerator = generator
		return this
	}
}
