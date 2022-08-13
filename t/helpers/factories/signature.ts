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
import Signature from "%/models/signature"
import UserFactory from "~/factories/user"
import FileLikeFactory from "~/factories/file-like"
import SignatureTransformer from "%/transformers/signature"

export default class SignatureFactory extends FileLikeFactory<
	Signature,
	SignatureResourceIdentifier,
	SignatureAttributes,
	SignatureResource,
	DeserializedSignatureResource,
	SignatureDocument<string>,
	SignatureListDocument,
	DeserializedSignatureDocument,
	DeserializedSignatureListDocument,
	SignatureTransformerOptions
> {
	#user: () => Promise<User> = async() => await new UserFactory().insertOne()

	get model(): ModelCtor<Signature> { return Signature }

	get transformer(): SignatureTransformer { return new SignatureTransformer() }

	async generate(): GeneratedData<Signature> {
		return {
			"userID": (await this.#user()).id,
			"fileContents": this.fileContentsGenerator()
		}
	}

	user(generator: () => Promise<User>): SignatureFactory {
		this.#user = generator
		return this
	}
}
