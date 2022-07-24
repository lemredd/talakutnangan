import type { GeneralObject, ValidationConstraints } from "!/types/independent"
import runThroughPipeline from "$/helpers/run_through_pipeline"
import Validator from "!/app/validators/base/base"
import ObjectValidator from "!/app/validators/base/object"

export default class extends Validator {
	private fields: ObjectValidator

	constructor(fields: { [key:string]: Validator }) {
		super("array")
		this.fields = new ObjectValidator(fields)
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

			if (fieldMeta.transformer !== undefined) {
				const transformer = fieldMeta.transformer
				transformedValues = transformedValues.map(transformer)
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
