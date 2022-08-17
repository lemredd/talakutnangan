import type { GeneralObject, Serializable } from "$/types/general"
import type { FileLikeTransformerOptions } from "%/types/independent"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import FileLike from "%/models/file-like"
import Transformer from "%/transformers/base"
import URLMaker from "$!/singletons/url_maker"
import Serializer from "%/transformers/serializer"

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

		const whiteListedAttributes = [ "id" ]

		if (options.extra.raw) {
			whiteListedAttributes.push("fileContents")
		}

		const safeObject = Serializer.whitelist(model, whiteListedAttributes)

		return safeObject
	}

	finalizeTransform(model: T|T[]|null, resource: Serializable): Serializable {
		const processedResource = super.finalizeTransform(model, resource) as GeneralObject

		if (processedResource.data) {
			const templatePath = `/api/${this.type}/:id`

			if (processedResource.data instanceof Array) {
				processedResource.data = processedResource.data.map(data => {
					if (!data.attributes.fileContents) {
						data.links = {
							"self": URLMaker.makeURLFromPath(templatePath, {
								"id": data.id
							})
						}
					}
					return data
				})
			} else if (!processedResource.data.attributes.fileContents) {
				processedResource.data.links = {
					"self": URLMaker.makeURLFromPath(templatePath, {
						"id": processedResource.data.id
					})
				}
			}
		}

		return processedResource
	}
}
