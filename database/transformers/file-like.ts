import type { GeneralObject } from "$/types/general"
import type { FileLikeTransformerOptions } from "%/types/independent"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import FileLike from "%/models/file-like"
import Transformer from "%/transformers/base"
import URLMaker from "$!/singletons/url_maker"
import Serializer from "%/transformers/serializer"
import processData from "%/helpers/process_data"

export default abstract class<
	T extends FileLike,
	U extends FileLikeTransformerOptions
> extends Transformer<T, U> {
	transform(
		model: T|T[],
		options: TransformerOptions<FileLikeTransformerOptions>
	): AttributesObject {
		if (!options.extra) {
			options.extra = { "raw": false }
		}

		const whiteListedAttributes = [ "id", ...this.otherWhiteListedAttributes ]

		if (options.extra.raw) {
			whiteListedAttributes.push("fileContents")
		}

		const safeObjects = Serializer.whitelist(model, whiteListedAttributes)

		const templatePath = `/api/${this.type}/:id`
		processData(safeObjects, safeObject => {
			const castSafeObject = safeObject as GeneralObject
			if (!castSafeObject.fileContents) {
				castSafeObject.fileContents = URLMaker.makeURLFromPath(templatePath, {
					"id": castSafeObject.id
				})
			}
		})
		return safeObjects
	}

	protected get otherWhiteListedAttributes(): string[] {
		return []
	}
}
