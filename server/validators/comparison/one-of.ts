import type {
	ValidationState,
	ValidationConstraints,
	OneOfRuleConstraints
} from "!/types/validation"

import isUndefined from "$/helpers/type_guards/is_undefined"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if is in the possible enumerated values.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<OneOfRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (isUndefined(constraints.oneOf)) {
		throw makeDeveloperError(constraints.field)
	}

	const { values } = constraints.oneOf

	if (values.includes(state.value)) {
		return state
	}

	const error = {
		"field": constraints.field,
		"friendlyName": constraints.friendlyName,
		"messageMaker": (field: string) => `Field "${field}" must be one of these: ${
			values.map(value => `"${value}"`).join(", ")
		}".`
	}

	throw error
}
