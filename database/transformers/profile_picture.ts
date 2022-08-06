import type { GeneralObject, Serializable } from "$/types/general"
import type { ProfilePictureTransformerOptions } from "%/types/independent"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import ProfilePicture from "%/models/profile_picture"
import Transformer from "%/transformers/base"
import URLMaker from "$!/singletons/url_maker"
import Serializer from "%/transformers/serializer"

export default class extends Transformer<ProfilePicture, ProfilePictureTransformerOptions> {
	constructor() {
		super()
		this.type = "profile_picture"
	}

	transform(
		model: ProfilePicture|ProfilePicture[],
		options: TransformerOptions<ProfilePictureTransformerOptions>
	): AttributesObject {
		if (options.extra === undefined) {
			options.extra = { raw: false }
		}

		const whiteListedAttributes = [ "id" ]

		if (options.extra.raw) {
			whiteListedAttributes.push("file")
		}

		const safeObject = Serializer.whitelist(model, whiteListedAttributes)

		return safeObject
	}

	finalizeTransform(model: ProfilePicture|ProfilePicture[]|null, resource: Serializable)
	: Serializable {
		resource = super.finalizeTransform(model, resource)

		if (resource.data !== undefined && resource.data !== null) {
			const templatePath = "/api/profile_picture/read/:id"

			if (resource.data instanceof Array) {
				resource.data = (resource.data as GeneralObject[]).map(data => {
					if (data.attributes.file === undefined) {
						data.links = {
							self: URLMaker.makeURLFromPath(templatePath, {
								id: data.id
							})
						}
					}
					return data
				})
			} else {
				if ((resource.data as GeneralObject).attributes.file === undefined) {
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
