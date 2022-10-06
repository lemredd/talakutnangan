import type { Model } from "%/types/dependent"
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

import BaseFactory from "~/factories/base"

export default abstract class TextContentLikeFactory<
	T extends Model,
	U extends ResourceIdentifier<"read">,
	V extends Attributes<"serialized">,
	W extends Attributes<"deserialized">,
	X extends Resource<"read", U, V>,
	Y extends DeserializedResource<U, W>,
	Z extends ResourceDocument<"read", U, V, X>,
	A extends ResourceListDocument<"read", U, V, X>,
	B extends DeserializedResourceDocument<U, W, Y>,
	C extends DeserializedResourceListDocument<U, W, Y>
> extends BaseFactory<T, U, V, W, X, Y, Z, A, B, C> {
	protected contentGenerator: () => string = () => faker.lorem.paragraphs(3)

	content(generator: () => string): TextContentLikeFactory<T, U, V, W, X, Y, Z, A, B, C> {
		this.contentGenerator = generator
		return this
	}
}
