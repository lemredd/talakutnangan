import type { ErrorPointer } from "!/types/independent"
import type {
	ValidationState,
	ValidationConstraints,
	ArrayRuleConstraints
} from "!/types/validation"

import validate from "!/validators/validate"
import unifyErrors from "!/validators/unify_errors"
import isUndefined from "$/type_guards/is_undefined"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if data is an array
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<ArrayRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (Array.isArray(state.value)) {
		if (isUndefined(constraints.array)) {
			throw makeDeveloperError(constraints.field)
		}

		const sanitizedInputs = []
		const unorderedInputs = new Map<number, any>()
		const errors: ErrorPointer[] = []
		const expectedSanitizeLength = state.value.length
		const promises: Promise<void>[] = []

		for (let i = 0; i < expectedSanitizeLength; ++i) {
			const subvalue = state.value[i]
			const promise = validate({
				[i]: constraints.array
			}, constraints.request, {
				[i]: subvalue
			}, constraints.source).then((input: { [key:number]: any }) => {
				unorderedInputs.set(i, input[i])
			}).catch(error => {
				const flattendedErrors = []
				if (Array.isArray(error)) {
					flattendedErrors.push(...error)
				} else {
					flattendedErrors.push(error as ErrorPointer|Error)
				}
				errors.push(...unifyErrors(`${i}`, flattendedErrors))
			})

			promises.push(promise)
		}

		await Promise.all(promises)

		if (errors.length > 0) {
			throw errors.map(error => ({
				"field": `${constraints.field}.${error.field}`,
				"friendlyName": error.friendlyName,
				"messageMaker": error.messageMaker
			}))
		} else {
			for (let i = 0, limit = unorderedInputs.size; i < limit; ++i) {
				sanitizedInputs.push(unorderedInputs.get(i))
			}

			return {
				"maySkip": false,
				"value": sanitizedInputs
			}
		}
	} else {
		const error = {
			"field": constraints.field,
			"friendlyName": constraints.friendlyName,
			"messageMaker": (field: string) => `Field "${field}" must be an array.`
		}

		throw error
	}
}
