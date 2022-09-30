/* eslint-disable no-negated-condition */
import type {
	ValidationState,
	ValidationConstraints,
	IsGreaterThanRuleConstraints
} from "!/types/validation"

import isUndefined from "$/type_guards/is_undefined"
import ensureUnequal from "!/validators/comparison/unequal_base"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if data is the greater than the data passed or pointed.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<IsGreaterThanRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (isUndefined(constraints.isGreaterThan)) {
		throw makeDeveloperError(constraints.field)
	}

	return ensureUnequal(
		state,
		constraints as ValidationConstraints,
		constraints.isGreaterThan,
		"greater",
		accessedValue => !Number.isNaN(Number(accessedValue)),
		(
			currentValue,
			targetValue
		) => targetValue === null || Number(currentValue) > Number(targetValue)
	)
}
