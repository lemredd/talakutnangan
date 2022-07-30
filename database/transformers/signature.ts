import type { GeneralObject } from "$/types/server"
import type { Serializable } from "$/types/database"
import type { SignatureTransformerOptions } from "%/types/independent"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"
import Signature from "%/models/signature"
import Transformer from "%/transformers/base"
import URLMaker from "$!/singletons/url_maker"
import Serializer from "%/transformers/serializer"

export default class extends Transformer<Signature, SignatureTransformerOptions> {
	constructor() {
		super()
		this.type = "signature"
	}

	transform(
		model: Signature|Signature[],
		options: TransformerOptions<SignatureTransformerOptions>
	): AttributesObject {
		if (options.extra === undefined) {
			options.extra = { raw: false }
		}

		const whiteListedAttributes = [ "id" ]

		if (options.extra.raw) {
			whiteListedAttributes.push("signature")
		}

		const safeObject = Serializer.whitelist(model, whiteListedAttributes)

		return safeObject
	}

	finalizeTransform(model: Signature|Signature[]|null, resource: Serializable): Serializable {
		resource = super.finalizeTransform(model, resource)

		if (resource.data !== undefined && resource.data !== null) {
			const templatePath = "/api/signature/:id"

			if (resource.data instanceof Array) {
				resource.data = (resource.data as GeneralObject[]).map(data => {
					if (data.attributes.signature === undefined) {
						data.links = {
							self: URLMaker.makeURLFromPath(templatePath, {
								id: data.id
							})
						}
					}
					return data
				})
			} else {
				if ((resource.data as GeneralObject).attributes.signature === undefined) {
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
