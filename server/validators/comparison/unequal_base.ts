/* eslint-disable no-negated-condition */
import type {
	ValidationState,
	ValidationConstraints,
	DynamicValue
} from "!/types/validation"

import isUndefined from "$/type_guards/is_undefined"
import accessDeepPath from "$!/helpers/access_deep_path"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator for unequal comparisons (greater than or less than).
 */
export default function<T>(
	currentState: ValidationState,
	constraints: ValidationConstraints,
	dynamicValue: DynamicValue<T>,
	comparisonWord: string,
	typeCompatibilityCheckFunction: (accessedValue: any) => boolean,
	comparisonFunction: (state: T, target: T) => boolean
): ValidationState {
	const state = currentState

	let targetValue: any = null

	if (!isUndefined(dynamicValue.value)) {
		targetValue = dynamicValue.value
	} else if (!isUndefined(dynamicValue.pointer)) {
		targetValue = accessDeepPath(constraints.source, dynamicValue.pointer)
	} else {
		throw makeDeveloperError(constraints.field)
	}

	if (typeCompatibilityCheckFunction(targetValue)) {
		if (comparisonFunction(state.value, targetValue)) {
			return state
		}

		const error = {
			"field": constraints.field,
			"friendlyName": constraints.friendlyName,
			"messageMaker": (field: string) => `Field "${field}" must be ${comparisonWord} than "${
				targetValue
			}".`
		}
		throw error
	}

	const error = {
		"field": constraints.field,
		"friendlyName": constraints.friendlyName,
		"messageMaker": (field: string) => `"${targetValue}" cannot be compared to field "${
			field
		}".`
	}
	throw error
}
