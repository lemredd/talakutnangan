import type {
	ValidationState,
	ValidationConstraints,
	UniqueRuleConstraints
} from "!/types/validation"

import isUndefined from "$/type_guards/is_undefined"
import accessDeepPath from "$!/helpers/access_deep_path"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if data unique/will be unique in the database
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<UniqueRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (isUndefined(constraints.manager) || isUndefined(constraints.unique)) {
		throw makeDeveloperError(constraints.field)
	}

	// eslint-disable-next-line new-cap
	const manager = new constraints.manager.className(
		constraints.request.transaction,
		constraints.request.cache
	)
	const foundModel = await manager.findOneOnColumn(constraints.manager.columnName, state.value, {
		"filter": {
			"existence": "*"
		}
	}) as any

	const foundID = foundModel.data?.id
	const id = accessDeepPath(constraints.source, constraints.unique.IDPath)

	if (foundModel.data === null || String(foundID) === String(id)) {
		return state
	}

	const error = {
		"field": constraints.field,
		"friendlyName": constraints.friendlyName,
		"messageMaker": (
			field: string,
			value: string
		) => `The ${value} in field "${field}" is not unique in the database".`
	}

	throw error
}
