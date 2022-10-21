import type { ErrorPointer } from "!/types/independent"
import type {
	ValidationState,
	ValidationConstraints,
	ObjectRuleConstraints
} from "!/types/validation"

import validate from "!/validators/validate"
import isPlainObject from "$/type_guards/is_plain_object"
import unifyErrors from "!/validators/unify_errors"
import isUndefined from "$/type_guards/is_undefined"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if data is an object
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<ObjectRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (isPlainObject(state.value)) {
		if (isUndefined(constraints.object)) {
			throw makeDeveloperError(constraints.field)
		}

		try {
			state.value = await validate(
				constraints.object,
				constraints.request,
				state.value,
				constraints.source
			)
			return state
		} catch (error) {
			const flattendedErrors: (ErrorPointer|Error)[] = []
			if (Array.isArray(error)) {
				flattendedErrors.push(...error)
			} else {
				flattendedErrors.push(error as ErrorPointer|Error)
			}

			const errors = unifyErrors("", flattendedErrors)

			throw errors.map(thrownError => ({
				"field": `${constraints.field}.${thrownError.field}`,
				"friendlyName": thrownError.friendlyName,
				"messageMaker": thrownError.messageMaker
			}))
		}
	} else {
		const error = {
			"field": constraints.field,
			"friendlyName": constraints.friendlyName,
			"messageMaker": (field: string) => `Field "${field}" must be an object.`
		}
		throw error
	}
}
