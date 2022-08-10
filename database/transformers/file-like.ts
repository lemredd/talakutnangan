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
		if (options.extra === undefined) {
			options.extra = { raw: false }
		}

		const whiteListedAttributes = [ "id" ]

		if (options.extra.raw) {
			whiteListedAttributes.push("fileContents")
		}

		const safeObject = Serializer.whitelist(model, whiteListedAttributes)

		return safeObject
	}

	finalizeTransform(model: T|T[]|null, resource: Serializable): Serializable {
		resource = super.finalizeTransform(model, resource)

		if (resource.data !== undefined && resource.data !== null) {
			const templatePath = `/api/${this.type}/:id`

			if (resource.data instanceof Array) {
				resource.data = (resource.data as GeneralObject[]).map(data => {
					if (data.attributes.fileContents === undefined) {
						data.links = {
							self: URLMaker.makeURLFromPath(templatePath, {
								id: data.id
							})
						}
					}
					return data
				})
			} else {
				if ((resource.data as GeneralObject).attributes.fileContents === undefined) {
					(resource.data as Serializable).links = {
						self: URLMaker.makeURLFromPath(templatePath, {
							id: (resource.data as GeneralObject).id
						})
					}
				}
			}
		}

		return resource
	}
}
