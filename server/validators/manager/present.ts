import type {
	ValidationState,
	ValidationConstraints,
	ManagerBasedRuleConstraints
} from "!/types/validation"

import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if data archived or exists in the database
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

	const manager = new constraints.manager.className(
		constraints.request.transaction,
		constraints.request.cache
	)
	const foundModel = await manager.findOneOnColumn(constraints.manager.columnName, state.value, {
		filter: {
			existence: "*"
		}
	})

	if (foundModel.data === null) {
		throw {
			field: constraints.field,
			messageMaker: (field: string, value: string) =>
				`The ${value} in field "${field}" is not existing or archived in the database".`
		}
	} else {
		return state
	}
}
