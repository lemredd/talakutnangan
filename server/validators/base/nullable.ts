import type {
	NullableConstraints,
	ValidationState,
	ValidationConstraints
} from "!/types/validation"

import isUndefined from "$/type_guards/is_undefined"

/**
 * Validator to allow data to be nullable.
 *
 * If nullable, it will skip the remaining rules unless there is a default value.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & NullableConstraints
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (
		isUndefined(state.value)
		|| state.value === null
		|| constraints.nullable?.mayConsiderEmptyStringAsNull
			&& state.value === ""
	) {
		if (isUndefined(constraints.nullable)) {
			state.maySkip = true
			state.value = null
		} else {
			state.value = constraints.nullable.defaultValue

			if (constraints.nullable?.mustSkipAfterSettingDefault) {
				state.maySkip = true
			}
		}
	}

	return state
}
