/* eslint-disable no-negated-condition */
import type {
	ValidationState,
	ValidationConstraints,
	SameRuleConstraints
} from "!/types/validation"

import accessDeepPath from "$!/helpers/access_deep_path"
import isUndefined from "$/type_guards/is_undefined"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if data is the same as the data passed.
 *
 * If it will be compared to a pointed value, it will be a loose comparison. Otherwise, it is
 * strict-type comparison.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<SameRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (isUndefined(constraints.same)) {
		throw makeDeveloperError(constraints.field)
	}

	if (!isUndefined(constraints.same.value)) {
		if (state.value == constraints.same.value) {
			return state
		}
		const error = {
			"field": constraints.field,
			"friendlyName": constraints.friendlyName,
			"messageMaker": (field: string) => `Field "${field}" must be "${
				constraints.same?.value
			}".`
		}
		throw error
	} else if (!isUndefined(constraints.same.pointer)) {
		const accessedValue = accessDeepPath(constraints.source, constraints.same.pointer)
		if (state.value == accessedValue) {
			return state
		}
		const error = {
			"field": constraints.field,
			"friendlyName": constraints.friendlyName,
			"messageMaker": (field: string) => `Field "${field}" must be "${accessedValue}".`
		}
		throw error
	} else {
		throw makeDeveloperError(constraints.field)
	}
}
