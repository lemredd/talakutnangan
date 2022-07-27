import type {
	ValidationState,
	ValidationConstraints,
	UniqueRuleConstraints
} from "!/types/independent"

import accessDeepPath from "!/helpers/access_deep_path"
import makeDeveloperError from "!/app/validators/make_developer_error"

/**
 * Validator to check if data unique/will be unique in the database
 */
 export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<UniqueRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if(state.maySkip) return state

	if (constraints.manager === undefined || constraints.unique === undefined) {
		throw makeDeveloperError(constraints.field)
	}

	// TODO: Get transaction manager from cache
	const manager = new constraints.manager.className()
	const foundModel = await manager.findOneOnColumn(constraints.manager.columnName, state.value, {
		filter: {
			existence: "*"
		},
		sort: []
	})

	const id = accessDeepPath(constraints.source, constraints.unique.IDPath)

	// TODO: Store found model in cache
	if (foundModel.data === null || (foundModel.data as any).id === id) {
		return state
	} else {
		throw {
			field: constraints.field,
			messageMaker: (field: string, value: string) =>
				`The ${value} in field "${field}" is not unique in the database".`
		}
	}
}
