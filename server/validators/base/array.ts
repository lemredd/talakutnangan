import type { ErrorPointer } from "!/types/independent"
import type {
	ValidationState,
	ValidationConstraints,
	ArrayRuleConstraints
} from "!/types/validation"

import validate from "!/validators/validate"
import unifyErrors from "!/validators/unify_errors"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if data is an array
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<ArrayRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if(state.maySkip) return state

	if (Array.isArray(state.value)) {
		if (constraints.array === undefined) {
			throw makeDeveloperError(constraints.field)
		}

		const sanitizedInputs = []
		const errors: ErrorPointer[] = []
		const expectedSanitizeLength = state.value.length

		for (let i = 0; i < expectedSanitizeLength; ++i ) {
			const subvalue = state.value[i]
			try {
				const sanitizedInput = await validate({
					[i]: constraints.array
				}, constraints.request, {
					[i]: subvalue
				}, constraints.source) as { [key:number]: any }

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
			return { value: sanitizedInputs, maySkip: false }
		}
	} else {
		throw {
			field: constraints.field,
			messageMaker: (field: string) => `Field "${field}" must be an array.`
		}
	}
}
