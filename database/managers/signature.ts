import type { ModelCtor } from "%/types/dependent"
import type { GeneralObject } from "$/types/server"
import type { RawSignature } from "$/types/database"
import type { SignatureTransformerOptions } from "%/types/independent"

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
}
