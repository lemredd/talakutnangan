import type {
	ValidationState,
	ValidationConstraints,
	NotRuleConstraints
} from "!/types/validation"

import validate from "!/validators/validate"
import isUndefined from "$/type_guards/is_undefined"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to inverse the validation of sub-rules.
 *
 * If sub-rules return an error, this validator will accept the value. If
 * sub-rules did not return an error, this validator will.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<NotRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (isUndefined(constraints.not)) {
		throw makeDeveloperError(constraints.field)
	}

	try {
		await validate(
			{ [constraints.field]: constraints.not },
			constraints.request,
			{ [constraints.field]: state.value },
			constraints.source
		)
	} catch (error) {
		return state
	}

	const error = {
		"field": constraints.field,
		"friendlyName": constraints.friendlyName,
		"messageMaker": (field: string) => `Field "${field}" is invalid.`
	}
	throw error
}
