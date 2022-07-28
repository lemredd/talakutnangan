import type { AttributesObject, TransformerOptions } from "%/types/dependent"
import Signature from "%/models/signature"
import Transformer from "%/transformers/base"
import URLMaker from "$!/singletons/url_maker"
import Serializer from "%/transformers/serializer"

export default class extends Transformer<Signature, { raw: boolean }> {
	constructor() {
		super()
		this.type = "signature"
	}

	transform(model: Signature|Signature[], options: TransformerOptions<{ raw: boolean }>): AttributesObject {
		if (options.extra === undefined) {
			options.extra = { raw: false }
		}

		const safeObject = Serializer.whitelist(model, [ "id" ])

		if (options.extra.raw) {
			if (model instanceof Array) {
				safeObject.data = (safeObject.data as any[]).map(data => {
					return {
						...data as AttributesObject,
						links: {
							self: URLMaker.makeURLFromPath("/api/signature/:id", { id: data.id })
						}
					}
				})
			} else {
				safeObject.data = {
					...safeObject.data as AttributesObject,
					links: {
						self: URLMaker.makeURLFromPath("/api/signature/:id", { id: model.id })
					}
				}
			}
		}

		return safeObject
	}
}
