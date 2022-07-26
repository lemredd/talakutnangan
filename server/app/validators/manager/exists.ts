import type {
	ValidationState,
	ValidationConstraints,
	ManagerBasedRuleConstraints
} from "!/types/independent"

import makeDeveloperError from "!/app/validators/make_developer_error"

/**
 * Validator to check if data belongs to an existing model in the database
 */
 export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<ManagerBasedRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if(state.maySkip) return state

	if (constraints.manager === undefined) {
		throw makeDeveloperError(constraints.field)
	}

	// TODO: Get transaction manager from cache
	const manager = new constraints.manager.className()
	const foundModel = await manager.findOneOnColumn(constraints.manager.columnName, state.value, {
		filter: {
			existence: "exists"
		}
	})

	// TODO: Store found model in cache
	if (foundModel.data === null) {
		throw {
			field: constraints.field,
			messageMaker: (field: string, value: string) =>
				`The ${value} in field "${field}" does not exists in the database".`
		}
	} else {
		return state
	}
}