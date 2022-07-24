import type {
	ValidationState,
	ValidationConstraints,
	ManagerBasedRuleConstraints
} from "!/types/independent"

/**
 * Validator to check if data belongs to an archived model in the database
 */
 export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & ManagerBasedRuleConstraints
): Promise<ValidationState> {
	const state = await currentState

	if(state.maySkip) return state

	// TODO: Get transaction manager from cache
	const manager = new constraints.manager()
	const foundModel = await manager.findOneOnColumn(constraints.columnName, state.value, {
		filter: {
			existence: "archived"
		}
	})

	// TODO: Store found model in cache
	if (foundModel.data === null) {
		throw {
			field: constraints.field,
			messageMaker: (field: string, value: string) =>
				`The ${value} in field "${field}" is not archived in the database".`
		}
	} else {
		return state
	}
}
