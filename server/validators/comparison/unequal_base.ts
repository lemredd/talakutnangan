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
	comparisonFunction: (state: T, target: T) => boolean,
	typeCompatibilityCheckFunction: (accessedValue: any) => boolean,
): ValidationState {
	const state = currentState
	if (!isUndefined(dynamicValue.value)) {
		if (comparisonFunction(state.value, dynamicValue.value)) {
			return state
		}

		const error = {
			"field": constraints.field,
			"friendlyName": constraints.friendlyName,
			"messageMaker": (field: string) => `Field "${field}" must be ${comparisonWord} than "${
				dynamicValue?.value
			}".`
		}
		throw error
	} else if (!isUndefined(dynamicValue.pointer)) {
		const accessedValue = accessDeepPath(constraints.source, dynamicValue.pointer)
		if (typeCompatibilityCheckFunction(accessedValue)) {
			if (comparisonFunction(state.value, accessedValue)) {
				return state
			}

			const error = {
				"field": constraints.field,
				"friendlyName": constraints.friendlyName,
				"messageMaker": (field: string) => `Field "${field}" must be ${comparisonWord} than "${
					accessedValue
				}".`
			}
			throw error
		}

		const error = {
			"field": constraints.field,
			"friendlyName": constraints.friendlyName,
			"messageMaker": (field: string) => `"${accessedValue}" cannot be compared to field "${
				field
			}".`
		}
		throw error
	} else {
		throw makeDeveloperError(constraints.field)
	}
}
