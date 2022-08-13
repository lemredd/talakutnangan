import type { GeneralObject, Serializable } from "$/types/general"
import type { SignatureTransformerOptions } from "%/types/independent"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"
import Signature from "%/models/signature"
import Transformer from "%/transformers/base"
import URLMaker from "$!/singletons/url_maker"
import Serializer from "%/transformers/serializer"

export default class extends Transformer<Signature, SignatureTransformerOptions> {
	constructor() {
		super("signature")
	}

	transform(
		model: Signature|Signature[],
		options: TransformerOptions<SignatureTransformerOptions>
	): AttributesObject {
		if (!options.extra) {
			options.extra = { "raw": false }
		}

		const whiteListedAttributes = [ "id" ]

		if (options.extra.raw) {
			whiteListedAttributes.push("signature")
		}

		const safeObject = Serializer.whitelist(model, whiteListedAttributes)

		return safeObject
	}

	finalizeTransform(model: Signature|Signature[]|null, resource: Serializable): Serializable {
		const processedResource = super.finalizeTransform(model, resource) as GeneralObject

		if (processedResource.data && processedResource.data !== null) {
			const templatePath = "/api/signature/:id"

			if (processedResource.data instanceof Array) {
				processedResource.data = processedResource.data.map(data => {
					if (!data.attributes.signature) {
						data.links = {
							"self": URLMaker.makeURLFromPath(templatePath, {
								"id": data.id
							})
						}
					}
					return data
				})
			} else if (!processedResource.data.attributes.signature) {
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
