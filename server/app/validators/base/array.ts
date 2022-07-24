import type { ValidationConstraints } from "!/types/independent"
import Validator from "!/app/validators/base/base"
import ObjectValidator from "!/app/validators/base/object"

export default class extends Validator {
	private fields: Validator

	constructor(fields: Validator) {
		super("array")
		this.fields = fields
	}

	get compiledObject(): ValidationConstraints {
		const { data, meta } = super.compiledObject
		const { data: fieldData, meta: fieldMeta } = this.fields.compiledObject

		data["defaultField"] = fieldData

		const pipedTransformers = function(value: any) {
			let transformedValues = value

			if (meta.transformer !== undefined) {
				transformedValues = meta.transformer(transformedValues)
			}

			if (fieldMeta.transformer !== undefined && transformedValues instanceof Array) {
				const transformer = fieldMeta.transformer
				transformedValues = transformedValues.map(transformer as (value: any) => any)
			}

			return transformedValues
		}

		return {
			data,
			meta: {
				transformer: pipedTransformers
			}
		}
	}
}
