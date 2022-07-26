import type {
	ErrorPointer,
	ValidationState,
	ValidationConstraints,
	ObjectRuleConstraints
} from "!/types/independent"

import isPlainObject from "lodash.isplainobject"
import validate from "!/app/validators/validate"
import unifyErrors from "!/app/validators/unify_errors"

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
			throw {
				field: constraints.field,
				messageMaker: (field: string) =>
					`Developer forgot to add contraints in object for field ${field}.`
			}
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
			messageMaker: (field: string) => `Field "${field}" must be an array.`
		}
	}
}