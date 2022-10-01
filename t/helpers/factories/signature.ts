import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type { SignatureTransformerOptions } from "%/types/independent"
import type {
	SignatureResourceIdentifier,
	SignatureAttributes,
	DeserializedSignatureResource,
	DeserializedSignatureDocument,
	DeserializedSignatureListDocument,
	SignatureResource,
	SignatureDocument,
	SignatureListDocument
} from "$/types/documents/signature"

import User from "%/models/user"
import Model from "%/models/signature"
import UserFactory from "~/factories/user"
import Transformer from "%/transformers/signature"
import FileLikeFactory from "~/factories/file-like"

export default class SignatureFactory extends FileLikeFactory<
	Model,
	SignatureResourceIdentifier<"read">,
	SignatureAttributes<"raw">,
	SignatureAttributes<"raw">,
	SignatureResource<"read", "raw">,
	DeserializedSignatureResource<"raw">,
	SignatureDocument<"read", "raw">,
	SignatureListDocument<"read", "raw">,
	DeserializedSignatureDocument<"raw">,
	DeserializedSignatureListDocument<"raw">,
	SignatureTransformerOptions
> {
	#user: () => Promise<User> = async() => await new UserFactory().insertOne()

	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	async generate(): GeneratedData<Model> {
		return {
			"fileContents": this.fileContentsGenerator(),
			"userID": (await this.#user()).id
		}
	}

	user(generator: () => Promise<User>): SignatureFactory {
		this.#user = generator
		return this
	}
}
