import type {
	ValidationState,
	ValidationConstraints,
	ManagerBasedRuleConstraints
} from "!/types/independent"

/**
 * Validator to check if data does not belong to an existing model in the database
 */
 export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<ManagerBasedRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if(state.maySkip) return state

	// TODO: Get transaction manager from cache
	const manager = new constraints.manager.className()
	const foundModel = await manager.findOneOnColumn(constraints.manager.columnName, state.value, {
		filter: {
			existence: "all"
		}
	})

	// TODO: Store found model in cache
	if (foundModel.data === null) {
		return state
	} else {
		throw {
			field: constraints.field,
			messageMaker: (field: string, value: string) =>
				`The ${value} in field "${field}" does exists in the database".`
		}
	}
}
