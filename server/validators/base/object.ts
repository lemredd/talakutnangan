import type { ErrorPointer } from "!/types/independent"
import type {
	ValidationState,
	ValidationConstraints,
	ObjectRuleConstraints
} from "!/types/validation"

import validate from "!/validators/validate"
import isPlainObject from "$/helpers/is_plain_object"
import unifyErrors from "!/validators/unify_errors"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if data is an array
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<ObjectRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if(state.maySkip) return state

	if (isPlainObject(state.value)) {
		if (constraints.object === undefined) {
			throw makeDeveloperError(constraints.field)
		}

		const sanitizedInputs: { [key:string]: any } = {}

		try {
			state.value = await validate(
				constraints.object,
				constraints.request,
				state.value,
				constraints.source
			)
			return state
		} catch(error) {
			const flattendedErrors: (ErrorPointer|Error)[] = []
			if (Array.isArray(error)) {
				flattendedErrors.push(...error)
			} else {
				flattendedErrors.push(error as ErrorPointer|Error)
			}

			const errors = unifyErrors("", flattendedErrors)

			throw errors.map(error => ({
				field: `${constraints.field}.${error.field}`,
				messageMaker: error.messageMaker
			}))
		}
	} else {
		throw {
			field: constraints.field,
			messageMaker: (field: string) => `Field "${field}" must be an object.`
		}
	}
}
