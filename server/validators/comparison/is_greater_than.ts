/* eslint-disable no-negated-condition */
import type {
	ValidationState,
	ValidationConstraints,
	IsGreaterThanRuleConstraints
} from "!/types/validation"

import isUndefined from "$/type_guards/is_undefined"
import accessDeepPath from "$!/helpers/access_deep_path"
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

	if (!isUndefined(constraints.isGreaterThan.value)) {
		if (state.value > constraints.isGreaterThan.value) {
			return state
		}

		const error = {
			"field": constraints.field,
			"friendlyName": constraints.friendlyName,
			"messageMaker": (field: string) => `Field "${field}" must be greater than "${
				constraints.isGreaterThan?.value
			}".`
		}
		throw error
	} else if (!isUndefined(constraints.isGreaterThan.pointer)) {
		const accessedValue = accessDeepPath(constraints.source, constraints.isGreaterThan.pointer)
		if (state.value > accessedValue) {
			return state
		}
		const error = {
			"field": constraints.field,
			"friendlyName": constraints.friendlyName,
			"messageMaker": (field: string) => `Field "${field}" must be greater than "${
				accessedValue
			}".`
		}
		throw error
	} else {
		throw makeDeveloperError(constraints.field)
	}
}
