import type { Request } from "!/types/dependent"
import type { GeneralObject } from "$/types/general"
import type { ErrorPointer } from "!/types/independent"
import type { FieldRules, ValidationConstraints } from "!/types/validation"

import unifyErrors from "!/validators/unify_errors"
import makeInitialState from "!/validators/make_initial_state"
import runThroughPipeline from "$/helpers/run_through_pipeline"

export default async function(
	fields: FieldRules,
	request: Request,
	input: GeneralObject,
	originalInput: GeneralObject = input
): Promise<GeneralObject> {
	type SuccessfulValidation = [ true, string, any ]
	type FailedValidation = [ false, string, ErrorPointer|ErrorPointer[] ]
	const fieldValidations: Promise<SuccessfulValidation|FailedValidation>[] = []

	for (const field in fields) {
		if (Object.hasOwn(fields, field)) {
			const rules = fields[field]
			const constraints: ValidationConstraints = {
				field,
				"friendlyName": rules.friendlyName,
				request,
				"source": originalInput,
				...rules.constraints ?? {}
			}

			const promise = runThroughPipeline(
				Promise.resolve(makeInitialState(input[field])),
				constraints,
				rules.pipes
			)
			.then(sanitizedValue => [ true, field, sanitizedValue.value ] as SuccessfulValidation)
			.catch(error => [ false, field, error ] as FailedValidation)

			fieldValidations.push(promise)
		}
	}

	const sanitizedInputs: { [key:string]: any } = {}
	const errors: ErrorPointer[] = []

	const sanitizedRecords = await Promise.all(fieldValidations)
	sanitizedRecords.forEach(([ isSuccess, fieldName, value ]) => {
		if (isSuccess) {
			sanitizedInputs[fieldName] = value
		} else {
			const flattendedErrors: (ErrorPointer|Error)[] = []

			if (Array.isArray(value)) {
				flattendedErrors.push(...value)
			} else {
				flattendedErrors.push(value as ErrorPointer)
			}

			errors.push(...unifyErrors(fieldName, flattendedErrors))
		}
	})

	if (errors.length > 0) {
		throw errors.sort((errorA, errorB) => errorA.field.localeCompare(errorB.field))
	}

	return sanitizedInputs
}
