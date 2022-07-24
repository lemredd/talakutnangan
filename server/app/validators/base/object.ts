import type {
	ErrorPointer,
	ValidationConstraints,
	ObjectRuleConstraints
} from "!/types/independent"

import isPlainObject from "lodash.isplainobject"
import validate from "!/app/validators/validate"
import unifyErrors from "!/app/validators/unify_errors"

/**
 * Validator to check if data is an array
 */
export default async function(
	currentState: Promise<any>,
	constraints: ValidationConstraints & ObjectRuleConstraints
): Promise<any> {
	const value = await currentState

	if (isPlainObject(value)) {
		const sanitizedInputs: { [key:string]: any } = {}

		try {
			return await validate(constraints.object, constraints.request, value)
		} catch(error) {
			const flattendedErrors: (ErrorPointer|Error)[] = []
			if (Array.isArray(error)) {
				flattendedErrors.push(...error)
			} else {
				flattendedErrors.push(error as ErrorPointer|Error)
			}

			const errors = unifyErrors("", flattendedErrors)

			if (errors.length > 0) {
				throw errors.map(error => ({
					field: `${constraints.field}.${error.field}`,
					messageMaker: error.messageMaker
				}))
			}
		}
	} else {
		throw {
			field: constraints.field,
			messageMaker: (field: string) => `Field "${field}" must be an array.`
		}
	}
}
