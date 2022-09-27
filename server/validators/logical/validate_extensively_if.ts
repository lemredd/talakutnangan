import type {
	ValidationState,
	ValidationConstraints,
	ValidateExtensivelyIfRuleConstraints
} from "!/types/validation"

import validate from "!/validators/validate"
import isUndefined from "$/type_guards/is_undefined"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to optionally validate value with other validators.
 *
 * If the condition, will ignore the rules to validate and continues to other rules in the pipe.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<ValidateExtensivelyIfRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (isUndefined(constraints.validateExtensivelyIf)) {
		throw makeDeveloperError(constraints.field)
	}

	const { value } = state
	const mustValidateExtensively = await constraints.validateExtensivelyIf.condition({
		"request": constraints.request,
		"source": constraints.source,
		value
	})
	if (!mustValidateExtensively) return state

	const subvalidation = await validate(
		{ [constraints.field]: constraints.validateExtensivelyIf.rules },
		constraints.request,
		{ [constraints.field]: value },
		constraints.source
	)

	return {
		"maySkip": state.maySkip,
		"value": subvalidation[constraints.field]
	}
}
