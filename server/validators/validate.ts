import type { Request } from "!/types/dependent"
import type { GeneralObject } from "$/types/general"
import type { ErrorPointer } from "!/types/independent"
import type { FieldRules, ValidationConstraints } from "!/types/validation"

import unifyErrors from "!/validators/unify_errors"
import runThroughPipeline from "$/helpers/run_through_pipeline"
import makeInitialState from "!/validators/make_initial_state"

export default async function(
	fields: FieldRules,
	request: Request,
	input: GeneralObject,
	originalInput: GeneralObject = input
): Promise<GeneralObject> {
	const sanitizedInputs: { [key:string]: any } = {}
	const errors: ErrorPointer[] = []

	for (const field in fields) {
		if (Object.hasOwn(fields, field)) {
			const rules = fields[field]

			try {
				const constraints: ValidationConstraints = {
					field,
					request,
					"source": originalInput,
					...rules.constraints ?? {}
				}
				const sanitizedInput = await runThroughPipeline(
					Promise.resolve(makeInitialState(input[field])),
					constraints,
					rules.pipes
				)

				sanitizedInputs[field] = sanitizedInput.value
			} catch (error) {
				const flattendedErrors: (ErrorPointer|Error)[] = []

				if (Array.isArray(error)) {
					flattendedErrors.push(...error)
				} else {
					flattendedErrors.push(error as ErrorPointer)
				}

				errors.push(...unifyErrors(field, flattendedErrors))
			}
		}
	}

	if (errors.length > 0) {
		throw errors.sort((errorA, errorB) => errorA.field.localeCompare(errorB.field))
	}

	return sanitizedInputs
}
