import type {
	ValidationState,
	ValidationConstraints,
	PresentRuleConstraints
} from "!/types/validation"

import accessDeepPath from "$!/helpers/access_deep_path"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if data archived or exists in the database
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<PresentRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if(state.maySkip) return state

	if (constraints.manager === undefined || constraints.present === undefined) {
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

	const foundID = (foundModel.data as any)?.id+""
	const id = accessDeepPath(constraints.source, constraints.present.IDPath)

	if (foundID === id) {
		return state
	} else {
		throw {
			field: constraints.field,
			messageMaker: (field: string, value: string) =>
				`The ${value} in field "${field}" is not existing or archived in the database".`
		}
	}
}