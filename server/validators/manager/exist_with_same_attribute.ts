import type { Request } from "!/types/dependent"
import type { GeneralObject } from "$/types/general"
import type {
	ValidationState,
	ValidationConstraints,
	ExistWithSameAttributeConstraint
} from "!/types/validation"

import accessDeepPath from "$!/helpers/access_deep_path"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if data is the same as any existing model in the database
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints<Request> & Partial<ExistWithSameAttributeConstraint>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (typeof constraints.manager === "undefined"
	|| typeof constraints.sameAttribute === "undefined") {
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
	})

	// TODO: Store found model in cache
	if (foundModel.data === null) {
		const error = {
			"field": constraints.field,
			"messageMaker": (
				field: string,
				value: string
			) => `The ${value} in field "${field}" does not exists in the database".`
		}
		throw error
	} else {
		const castData = foundModel.data as GeneralObject
		const targetData = castData.attributes[constraints.sameAttribute.columnName]
		if (typeof constraints.sameAttribute.value !== "undefined") {
			if (targetData == constraints.sameAttribute.value) {
				return state
			}
			const error = {
				"field": constraints.field,
				"messageMaker": (field: string) => `Field "${field}" must be "${
					constraints.sameAttribute?.value
				}".`
			}
			throw error
		} else if (typeof constraints.sameAttribute.pointer !== "undefined") {
			const accessedValue = accessDeepPath(constraints.source, constraints.sameAttribute.pointer)
			if (state.value == accessedValue) {
				return state
			}
			const error = {
				"field": constraints.field,
				"messageMaker": (field: string) => `Field "${field}" must be "${accessedValue}".`
			}
			throw error
		}

		throw makeDeveloperError(constraints.field)
	}
}
