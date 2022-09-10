import type {
	ValidationState,
	ValidationConstraints,
	SizeConstraints
} from "!/types/validation"

import isUndefined from "$/type_guards/is_undefined"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if the size of a JSON is within the specific length.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<SizeConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (isUndefined(constraints.size)) {
		throw makeDeveloperError(constraints.field)
	}

	const jsonLength = JSON.stringify(state.value).length

	if (
		!isUndefined(constraints.size.minimum)
		&& jsonLength < constraints.size.minimum) {
		const error = {
			"field": constraints.field,
			"friendlyName": constraints.friendlyName,
			"messageMaker": (
				field: string
			) => `Field "${field}" must be more than or equal to ${
				constraints.size?.minimum
			} character(s).`
		}

		throw error
	}

	if (
		!isUndefined(constraints.size.maximum)
		&& constraints.size.maximum < jsonLength) {
		const error = {
			"field": constraints.field,
			"friendlyName": constraints.friendlyName,
			"messageMaker": (field: string) => `Field "${field}" must be less than or equal to ${
				constraints.size?.maximum
			} character(s).`
		}

		throw error
	}

	return state
}
