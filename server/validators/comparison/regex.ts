import type {
	ValidationState,
	ValidationConstraints,
	RegexRuleConstraints
} from "!/types/validation"

import makeDeveloperError from "!/validators/make_developer_error"

/**
 *	Validator to check regex
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<RegexRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if(state.maySkip) return state

	if (constraints.regex === undefined) {
		throw makeDeveloperError(constraints.field)
	}

	if (constraints.regex.match.test(state.value)) {
		return state
	} else {
		throw {
			field: constraints.field,
			messageMaker: (field: string) => `Field "${field}" must match "${constraints.regex?.match}".`
		}
	}

}
