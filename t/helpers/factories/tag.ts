import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type {
	TagResourceIdentifier,
	TagAttributes,
	DeserializedTagResource,
	DeserializedTagDocument,
	DeserializedTagListDocument,
	TagResource,
	TagDocument,
	TagListDocument
} from "$/types/documents/tag"

import { faker } from "@faker-js/faker"

import Tag from "%/models/tag"
import BaseFactory from "~/factories/base"
import TagTransformer from "%/transformers/tag"

export default class TagFactory extends BaseFactory<
	Tag,
	TagResourceIdentifier,
	TagAttributes<"serialized">,
	TagAttributes<"deserialized">,
	TagResource,
	DeserializedTagResource,
	TagDocument,
	TagListDocument,
	DeserializedTagDocument,
	DeserializedTagListDocument
> {
	#name: () => string = () => faker.random.word() + faker.random.word()
	get model(): ModelCtor<Tag> { return Tag }

	get transformer(): TagTransformer { return new TagTransformer() }

	generate(): GeneratedData<Tag> {
		return Promise.resolve({
			"name": this.#name()
		})
	}

	name(name: () => string): TagFactory {
		this.#name = name
		return this
	}
}
