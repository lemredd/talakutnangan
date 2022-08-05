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

import dataURIToBuffer from "data-uri-to-buffer"
import type { MimeBuffer } from "data-uri-to-buffer"
import { faker } from "@faker-js/faker"

import User from "%/models/user"
import Signature from "%/models/signature"
import UserFactory from "~/factories/user"
import BaseFactory from "~/factories/base"
import SignatureTransformer from "%/transformers/signature"

export default class SignatureFactory extends BaseFactory<
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
	#user: () => Promise<User>  =  () => new UserFactory().insertOne()
	#signature: () => MimeBuffer = () => dataURIToBuffer(faker.image.dataUri())

	get model(): ModelCtor<Signature> { return Signature }

	get transformer(): SignatureTransformer { return new SignatureTransformer() }

	async generate(): GeneratedData<Signature> {
		return {
			userID: (await this.#user()).id,
			signature: this.#signature()
		}
	}

	signature(generator: () => MimeBuffer): SignatureFactory {
		this.#signature = generator
		return this
	}

	user(generator: () => Promise<User>): SignatureFactory {
		this.#user = generator
		return this
	}
}
