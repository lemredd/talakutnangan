import type { IncludedRelationships } from "%/types/independent"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import Transformer from "%/transformers/base"
import UserTransformer from "%/transformers/user"
import Serializer from "%/transformers/serializer"
import AsynchronousLike from "%/models/asynchronous-like"

type Relationships = "user"

export default abstract class<T extends AsynchronousLike, U> extends Transformer<T, U> {
	constructor(type: string, { included }: IncludedRelationships<Relationships> = {
		"included": [ "user" ]
	}) {
		super(type, [
			included.indexOf("user") > -1
				? {
					"attribute": "user",
					"transformer": new UserTransformer()
				}
				: null
		])
	}

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
			...this.determineOtherWhiteListedAttributes(options)
		]

		const safeObjects = Serializer.whitelist(model, whiteListedAttributes)

		return safeObjects
	}

	protected determineOtherWhiteListedAttributes(unusedOptions: TransformerOptions<U>): string[] {
		return []
	}
}
