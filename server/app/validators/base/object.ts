import type { Pipe } from "$/types/database"
import type { RuleData } from "!/types/dependent"
import type { GeneralObject, Descriptor, ValidationConstraints } from "!/types/independent"

import validate from "!/app/validators/validate"
import Validator from "!/app/validators/base/base"
import runThroughPipeline from "$/helpers/run_through_pipeline"

export default class ObjectValidator extends Validator {
	private fields: Descriptor

	constructor(fields: Descriptor, typeValidator = "object") {
		super(typeValidator)
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

		(data as RuleData).asyncValidator = async (rule, value, callback, source, options) => {
			await validate(this.fields, value, options).then(() => callback()).catch(callback)
		}

		const pipedTransformers = (value: any) => {
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

			return this.transformAll(transformedValue, linkedTransformers)
		}

		return {
			data,
			meta: {
				transformer: pipedTransformers
			}
		}
	}

	protected get fieldName(): string { return "fields" }

	protected transformAll(value: any, transformers: Pipe<any, {}>[]): any {
		return runThroughPipeline(value, {}, transformers)
	}
}
