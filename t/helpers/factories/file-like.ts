import type { FileLikeTransformerOptions } from "%/types/independent"
import type {
	FileLikeResourceIdentifier,
	FileLikeAttributes,
	DeserializedFileLikeResource,
	DeserializedFileLikeDocument,
	DeserializedFileLikeListDocument
} from "$/types/documents/file-like"

import dataURIToBuffer from "data-uri-to-buffer"
import type { MimeBuffer } from "data-uri-to-buffer"
import { faker } from "@faker-js/faker"

import BaseFactory from "~/factories/base"
import FileLike from "%/models/file-like"

export default abstract class FileLikeFactory extends BaseFactory<
	FileLike,
	FileLikeResourceIdentifier,
	FileLikeAttributes,
	DeserializedFileLikeResource,
	DeserializedFileLikeDocument,
	DeserializedFileLikeListDocument,
	FileLikeTransformerOptions
> {
	protected fileContentsGenerator: () => MimeBuffer|null = () => dataURIToBuffer(
		faker.image.dataUri()
	)

	fileContents(generator: () => MimeBuffer|null): FileLikeFactory {
		this.fileContentsGenerator = generator
		return this
	}
}
