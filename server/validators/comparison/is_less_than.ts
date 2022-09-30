import type {
	ValidationState,
	ValidationConstraints,
	IsLessThanRuleConstraints
} from "!/types/validation"

import isUndefined from "$/type_guards/is_undefined"
import ensureUnequal from "!/validators/comparison/unequal_base"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if data is the less than the data passed or pointed.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<IsLessThanRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (isUndefined(constraints.isLessThan)) {
		throw makeDeveloperError(constraints.field)
	}

	return ensureUnequal(
		state,
		constraints as ValidationConstraints,
		constraints.isLessThan,
		"less",
		accessedValue => !Number.isNaN(Number(accessedValue)),
		(
			currentValue,
			targetValue
		) => targetValue === null || Number(currentValue) < Number(targetValue)
	)
}
