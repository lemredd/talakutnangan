/* eslint-disable no-negated-condition */
import type {
	ValidationState,
	ValidationConstraints,
	DivisibleByConstraints
} from "!/types/validation"

import isUndefined from "$/type_guards/is_undefined"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if data is divisible by specific number
 *
 * If it will be check if the number or date is divisible by a specific number
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<DivisibleByConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (isUndefined(constraints.divisibleBy)) {
		throw makeDeveloperError(constraints.field)
	}

	if (!isUndefined(constraints.divisibleBy.value)) {
		if (state.value % constraints.divisibleBy.value == 0) {
			return state
		}
		const error = {
			"field": constraints.field,
			"friendlyName": constraints.friendlyName,
			"messageMaker": (field: string) => `Field "${field}" must be divisible by"${
				constraints.divisibleBy?.value
			}".`
		}
		throw error
	} else {
		throw makeDeveloperError(constraints.field)
	}
}
