import type { ErrorPointer, FieldRules } from "!/types/independent"
import type { ValidationConstraints, Request } from "!/types/dependent"

import runThroughPipeline from "$/helpers/run_through_pipeline"

export default async function(fields: FieldRules, request: Request, input: { [key:string]: any })
: Promise<object> {
	const sanitizedInputs: { [key:string]: any } = {}
	const errors: ErrorPointer[] = []

	for (const field in fields) {
		if (Object.prototype.hasOwnProperty.call(fields, field)) {
			const rules = fields[field]

			try {
				const constraints: ValidationConstraints = {
					request,
					field,
					...rules.constraints
				}
				const sanitizedInput = await runThroughPipeline(
					Promise.resolve(input[field]),
					constraints,
					rules.pipes
				)

				sanitizedInputs[field] = sanitizedInput
			} catch(error) {
				if (error instanceof Error) {
					errors.push({
						field,
						messageMaker: (
							field: string,
							value: any
						): string => `Unexpected error happened while validating ${field}`
					})
				} else {
					errors.push(error as ErrorPointer)
				}
			}
		}
	}

	if (errors.length > 0) {
		throw errors.map(error => ({
			field: error.field,
			message: error.messageMaker(error.field, input[error.field])
		}))
	}

	return sanitizedInputs
}
