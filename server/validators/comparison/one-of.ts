import type {
	ValidationState,
	ValidationConstraints,
	OneOfRuleConstraints
} from "!/types/validation"

import isString from "$/type_guards/is_string"
import isUndefined from "$/type_guards/is_undefined"
import accessDeepPath from "$!/helpers/access_deep_path"
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

	const { values, pointer } = constraints.oneOf
	let possibleValues = values
	if (isUndefined(values)) {
		if (isString(pointer)) {
			const accessedValue = accessDeepPath(constraints.source, pointer)

			if (Array.isArray(accessedValue)) {
				possibleValues = accessedValue
			} else {
				throw makeDeveloperError(constraints.field)
			}
		} else {
			throw makeDeveloperError(constraints.field)
		}
	} else {
		possibleValues = possibleValues as any[]
	}

	if (possibleValues.includes(state.value)) {
		return state
	}

	const error = {
		"field": constraints.field,
		"friendlyName": constraints.friendlyName,
		"messageMaker": (field: string) => `Field "${field}" must be one of these: ${
			possibleValues?.map(value => `"${value}"`).join(", ")
		}".`
	}

	throw error
}
