import Schema from "async-validator"
import type { RuleData, ValidationError } from "!/types/dependent"
import type { MetaValidationConstraints } from "!/types/independent"

import Validator from "!/app/validators/base/base"

export default async function(descriptor: { [key:string]: Validator }, input: object)
: Promise<object> {
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
		return await validator.validate(input, { first: true, firstFields: true })
	} catch(errorObject) {
		const errors = (errorObject as any).errors as ValidationError[]

		throw errors.map(error => ({ field: error.field, message: error.message }))
	}
}
