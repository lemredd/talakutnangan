import Schema from "async-validator"
import type { RuleData, ValidationError } from "!/types/dependent"
import type { MetaValidationConstraints, Descriptor } from "!/types/independent"

export default async function(
	descriptor: Descriptor,
	input: object,
	options: object = {},
	mustBeRaw: boolean = false
): Promise<object> {
	const properDescriptor: { [key:string]: RuleData } = {}

	for (const field in descriptor) {
		if (Object.prototype.hasOwnProperty.call(descriptor, field)) {
			const validator = descriptor[field];
			const { data, meta }: {
				data: RuleData,
				meta: MetaValidationConstraints
			} = validator.compiledObject

			if (meta.transformer) {
				data.transform = meta.transformer as (value: any) => any
			}

			properDescriptor[field] = data
		}
	}

	try {
		const validator = new Schema(properDescriptor)
		return await validator.validate(input, options)
	} catch(errorObject) {
		const errors = (errorObject as any).errors as ValidationError[]

		if (mustBeRaw) throw errorObject
		else throw errors?.map(error => ({ field: error.field, message: error.message }))
	}
}
