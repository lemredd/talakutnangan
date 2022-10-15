import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type { FileLikeTransformerOptions } from "%/types/independent"
import type {
	AsynchronousFileResourceIdentifier,
	AsynchronousFileAttributes,
	DeserializedAsynchronousFileResource,
	DeserializedAsynchronousFileDocument,
	DeserializedAsynchronousFileListDocument,
	AsynchronousFileResource,
	AsynchronousFileDocument,
	AsynchronousFileListDocument
} from "$/types/documents/asynchronous_file"

import { faker } from "@faker-js/faker"
import dataURIToBuffer, { MimeBuffer } from "data-uri-to-buffer"

import Model from "%/models/asynchronous_file"
import Transformer from "%/transformers/asynchronous_file"
import AsynchronousLikeFactory from "~/factories/asynchronous-like"

export default class AsynchronousFileFactory extends AsynchronousLikeFactory<
	Model,
	AsynchronousFileResourceIdentifier<"read">,
	AsynchronousFileAttributes<"raw">,
	AsynchronousFileAttributes<"raw">,
	AsynchronousFileResource<"read", "raw">,
	DeserializedAsynchronousFileResource<"raw">,
	AsynchronousFileDocument<"read", "raw">,
	AsynchronousFileListDocument<"read", "raw">,
	DeserializedAsynchronousFileDocument<"raw">,
	DeserializedAsynchronousFileListDocument<"raw">,
	FileLikeTransformerOptions
> {
	protected fileContentsGenerator: () => MimeBuffer|null = () => dataURIToBuffer(
		faker.image.dataUri()
	)

	fileContents(generator: () => MimeBuffer|null): AsynchronousFileFactory {
		this.fileContentsGenerator = generator
		return this
	}

	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	async generate(): GeneratedData<Model> {
		return {
			"extra": this.extraGenerator(),
			"fileContents": this.fileContentsGenerator(),
			"finishedStepCount": this.finishedStepCountGenerator(),
			"hasStopped": this.hasStoppedGenerator(),
			"origin": this.originGenerator(),
			"token": await this.tokenGenerator(),
			"totalStepCount": this.totalStepCountGenerator(),
			"userID": (await this.userGenerator()).id
		}
	}
}
