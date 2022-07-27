import dataURIToBuffer from "data-uri-to-buffer"
import type { MimeBuffer } from "data-uri-to-buffer"
import { faker } from "@faker-js/faker"

import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"

import User from "%/models/user"
import Signature from "%/models/signature"
import UserFactory from "~/factories/user"
import BaseFactory from "~/factories/base"

export default class SignatureFactory extends BaseFactory<Signature> {
	#user: () => Promise<User>  =  () => new UserFactory().insertOne()
	#signature: () => MimeBuffer = () => dataURIToBuffer(faker.image.dataUri())

	get model(): ModelCtor<Signature> { return Signature }

	async generate(): GeneratedData<Signature> {
		return {
			userID: (await this.#user()).id,
			signature: this.#signature
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
