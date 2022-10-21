import type {
	ValidationState,
	ValidationConstraints,
	RegexRuleConstraints
} from "!/types/validation"

import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check regex
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<RegexRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (!constraints.regex) {
		throw makeDeveloperError(constraints.field)
	}

	if (constraints.regex.match.test(state.value)) {
		return state
	}

	const error = {
		"field": constraints.field,
		"friendlyName": constraints.friendlyName,
		"messageMaker": (
			field: string
		) => `Field "${field}" must match "${constraints.regex?.friendlyDescription}".`
	}
	throw error
}
