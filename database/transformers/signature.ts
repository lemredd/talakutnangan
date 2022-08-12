import type { SignatureTransformerOptions } from "%/types/independent"
import Signature from "%/models/signature"
import FileLikeTransformer from "%/transformers/file-like"

export default class extends FileLikeTransformer<Signature, SignatureTransformerOptions> {
	constructor() {
		super("signature")
	}
}
