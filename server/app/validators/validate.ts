import type { GeneralObject } from "$/types/server"
import type { Request } from "!/types/dependent"
import type {
	ErrorPointer,
	FieldRules,
	ValidationConstraints
} from "!/types/independent"

import unifyErrors from "!/app/validators/unify_errors"
import runThroughPipeline from "$/helpers/run_through_pipeline"
import makeInitialState from "!/app/validators/make_initial_state"

export default async function(
	fields: FieldRules,
	request: Request,
	input: GeneralObject,
	originalInput: GeneralObject = input
): Promise<GeneralObject> {
	const sanitizedInputs: { [key:string]: any } = {}
	const errors: ErrorPointer[] = []

	for (const field in fields) {
		if (Object.prototype.hasOwnProperty.call(fields, field)) {
			const rules = fields[field]

			try {
				const constraints: ValidationConstraints = {
					request,
					source: originalInput,
					field,
					...rules.constraints
				}
				const sanitizedInput = await runThroughPipeline(
					Promise.resolve(makeInitialState(input[field])),
					constraints,
					rules.pipes
				)

				sanitizedInputs[field] = sanitizedInput.value
			} catch(error) {
				const flattendedErrors: (ErrorPointer|Error)[] = []

				if (Array.isArray(error)) {
					flattendedErrors.push(...error)
				} else {
					flattendedErrors.push(error as ErrorPointer)
				}

				errors.push(...unifyErrors(field, flattendedErrors))
			}
			const sanitizedInput = await runThroughPipeline(
				Promise.resolve(makeInitialState(input[field])),
				constraints,
				rules.pipes
			)

			sanitizedInputs[field] = sanitizedInput.value
		} catch(error) {
			const flattendedErrors: (ErrorPointer|Error)[] = []

			if (Array.isArray(error)) {
				flattendedErrors.push(...error)
			} else {
				flattendedErrors.push(error as ErrorPointer)
			}

			errors.push(...unifyErrors(field, flattendedErrors))
		}
	}

	if (errors.length > 0) {
		throw errors
	}

	return sanitizedInputs
}
