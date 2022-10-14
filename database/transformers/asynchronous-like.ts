import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import Transformer from "%/transformers/base"
import Serializer from "%/transformers/serializer"
import AsynchronousLike from "%/models/asynchronous-like"

export default abstract class<T extends AsynchronousLike, U> extends Transformer<T, U> {
	transform(
		model: T|T[],
		options: TransformerOptions<U>
	): AttributesObject {
		const whiteListedAttributes = [
			"id",
			"token",
			"finishedStepCount",
			"totalStepCount",
			"hasStopped",
			"extra",
			...this.determineWhiteListedAttributes(options)
		]

		const safeObjects = Serializer.whitelist(model, whiteListedAttributes)

		return safeObjects
	}

	protected determineWhiteListedAttributes(unusedOptions: TransformerOptions<U>): string[] {
		return []
	}
}
