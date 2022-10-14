import type { GeneralObject } from "$/types/general"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"
import type { FileLikeTransformerOptions, IncludedRelationships } from "%/types/independent"

import URLMaker from "$!/singletons/url_maker"
import processData from "%/helpers/process_data"
import isUndefined from "$/type_guards/is_undefined"
import AsynchronousFile from "%/models/asynchronous_file"
import AsynchronousLikeTransformer from "%/transformers/asynchronous-like"

type Relationships = "user"

export default class extends AsynchronousLikeTransformer<
	AsynchronousFile, FileLikeTransformerOptions
> {
	private readTemplatePath: string

	constructor({
		included,
		readTemplatePath = ""
	}: IncludedRelationships<Relationships> & { readTemplatePath?: string } = {
		"included": [ "user" ]
	}) {
		super("asynchronous_file", { included })

		this.readTemplatePath = readTemplatePath
	}

	transform(
		model: AsynchronousFile|AsynchronousFile[],
		options: TransformerOptions<FileLikeTransformerOptions>
	): AttributesObject {
		const safeObjects = super.transform(model, options)

		const templatePath = this.readTemplatePath
		processData(safeObjects, safeObject => {
			const castSafeObject = safeObject as GeneralObject
			if (!castSafeObject.fileContents) {
				castSafeObject.fileContents = URLMaker.makeURLFromPath(templatePath, {
					"id": castSafeObject.id,
					"type": this.type
				})
			}
		})
		return safeObjects
	}

	protected determineOtherWhiteListedAttributes(
		options: TransformerOptions<FileLikeTransformerOptions>
	): string[] {
		if (isUndefined(options.extra)) {
			options.extra = { "raw": false }
		}

		if (options.extra.raw) {
			return [ "fileContents" ]
		}

		return []
	}
}
