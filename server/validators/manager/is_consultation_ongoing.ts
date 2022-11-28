import type { Request } from "!/types/dependent"
import type { ValidationState, ValidationConstraints } from "!/types/validation"
import type { DeserializedConsultationDocument } from "$/types/documents/consultation"

import deserialize from "$/object/deserialize"

import Manager from "%/managers/consultation"

/**
 * Validator to check if a consultation has no other consultation activated.
 *
 * Note: The validator only works for resources with numerical consultation IDs only.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints<Request>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	const manager = new Manager(constraints.request)

	const modelID = state.value
	const foundModel = await manager.findWithID(Number(modelID))

	if (foundModel.data === null) {
		const error = {
			"field": constraints.field,
			"friendlyName": constraints.friendlyName,
			"messageMaker": (
				field: string,
				value: string
			) => {
				const subject = `The consultation with an ID of "${value}"`
				const predicate = "does not exist."

				return `${subject} ${predicate}`
			}
		}

		throw error
	}

	const deserializedFoundModel = deserialize(foundModel) as DeserializedConsultationDocument
	const hasNotFinished = deserializedFoundModel.data.finishedAt === null
	const isNotCanceled = deserializedFoundModel.data.deletedAt === null
	const hasStarted = deserializedFoundModel.data.startedAt !== null

	if (hasStarted && hasNotFinished && isNotCanceled) return state

	const error = {
		"field": constraints.field,
		"friendlyName": constraints.friendlyName,
		"messageMaker": (
			field: string,
			value: string
		) => {
			const subject = `The consultation with an ID of "${value}"`
			const predicate = "should be ongoing."

			return `${subject} ${predicate}`
		}
	}

	throw error
}
