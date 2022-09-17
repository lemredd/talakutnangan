import type { ModelCtor } from "%/types/dependent"
import type { RawSignature } from "$!/types/independent"
import type { GeneralObject, Serializable } from "$/types/general"
import type { SignatureTransformerOptions } from "%/types/independent"

import Log from "$!/singletons/log"
import BaseManager from "%/managers/base"
import Signature from "%/models/signature"
import SignatureTransformer from "%/transformers/signature"

export default class extends BaseManager<
	Signature,
	RawSignature,
	GeneralObject,
	SignatureTransformerOptions
> {
	get model(): ModelCtor<Signature> { return Signature }

	get transformer(): SignatureTransformer { return new SignatureTransformer() }

	async attach(userID: number, fileContents: Buffer)
	: Promise<Serializable> {
		try {
			await this.model.destroy({
				"where": {
					userID
				},
				...this.transaction.transactionObject
			})

			Log.success("manager", "done archiving previous signature")

			return await this.create({
				fileContents,
				userID
			}, { "raw": false })
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}
}
