import type { ValidationConstraints, ErrorPointer, ArrayRuleConstraints } from "!/types/independent"

import validate from "!/app/validators/validate"
import unifyErrors from "!/app/validators/unify_errors"

/**
 * Validator to check if data is an array
 */
export default async function(
	currentState: Promise<any>,
	constraints: ValidationConstraints & ArrayRuleConstraints
): Promise<any> {
	const value = await currentState

	if (Array.isArray(value)) {
		const sanitizedInputs = []
		const errors: ErrorPointer[] = []
		const expectedSanitizeLength = value.length

		if (constraints.array.minimum && expectedSanitizeLength < constraints.array.minimum) {
			throw {
				field: constraints.field,
				messageMaker: (field: string) =>
					`Field "${field}" must have more than ${constraints.array.minimum}.`
			}
		}

		if (constraints.array.maximum && constraints.array.maximum > expectedSanitizeLength) {
			throw {
				field: constraints.field,
				messageMaker: (field: string) =>
					`Field "${field}" must have more than ${constraints.array.maximum}.`
			}
		}

		for (let i = 0; i < expectedSanitizeLength; ++i ) {
			const subvalue = value[i]
			try {
				const sanitizedInput = await validate({
					[i]: constraints.array.rules
				}, constraints.request, {
					[i]: subvalue
				}) as { [key:number]: any }

				sanitizedInputs.push(sanitizedInput[i])
			} catch(error) {
				let flattendedErrors = []
				if (Array.isArray(error)) {
					flattendedErrors.push(...error)
				} else {
					flattendedErrors.push(error as ErrorPointer|Error)
				}
				errors.push(...unifyErrors(i+"", flattendedErrors))
			}
		}

		if (errors.length > 0) {
			throw errors.map(error => ({
				field: `${constraints.field}.${error.field}`,
				messageMaker: error.messageMaker
			}))
		} else {
			return sanitizedInputs
		}
	} else {
		throw {
			field: constraints.field,
			messageMaker: (field: string) => `Field "${field}" must be an array.`
		}
	}
}
