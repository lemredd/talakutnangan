import type { GeneralObject, ValidationConstraints } from "!/types/independent"
import runThroughPipeline from "$/helpers/run_through_pipeline"
import Validator from "!/app/validators/validator"

export default class extends Validator {
	private fields: { [key:string]: Validator }

	constructor(fields: { [key:string]: Validator }) {
		super("object")
		this.fields = fields
	}

	get compiledObject(): ValidationConstraints {
		const { data, meta } = super.compiledObject
		const fieldData: GeneralObject = {}
		const transformers: { field: string, transformer?: Function }[] = []

		for (const field in this.fields) {
			if (Object.prototype.hasOwnProperty.call(this.fields, field)) {
				const validator = this.fields[field];
				const { data, meta } = validator.compiledObject
				fieldData[field] = data
				transformers.push({
					field,
					transformer: meta.transformer
				})
			}
		}

		data["fields"] = fieldData

		const pipedTransformers = function(value: any) {
			let transformedValue = value

			if (meta.transformer !== undefined) {
				transformedValue = meta.transformer(transformedValue)
			}

			const linkedTransformers = transformers.map(transformerInfo => {
				if(transformerInfo.transformer === undefined) {
					return (value: GeneralObject) => value
				} else {
					return (value: GeneralObject, constraints: any) => {
						let nestedValue = value[transformerInfo.field]
						if(nestedValue === undefined) {
							return nestedValue
						} else {
							return transformerInfo.transformer!(nestedValue)
						}
					}
				}
			})
			return runThroughPipeline(transformedValue, {}, linkedTransformers)
		}

		return {
			data,
			meta: {
				transformer: pipedTransformers
			}
		}
	}
}
