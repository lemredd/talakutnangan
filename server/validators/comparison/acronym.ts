import type {
	ValidationState,
	ValidationConstraints,
	AcronymRuleConstraints
} from "!/types/validation"

import accessDeepPath from "$!/helpers/access_deep_path"
import isUndefined from "$/type_guards/is_undefined"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if data is the proper acronym of the other field
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<AcronymRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (isUndefined(constraints.acronym)) {
		throw makeDeveloperError(constraints.field)
	}

	const source: string = accessDeepPath(constraints.source, constraints.acronym.spelledOutPath)

	const separatedSource = source
	.split(" ")
	.filter(word => word.slice(0, 1) === word.slice(0, 1).toLocaleUpperCase())
	const castValue = state.value as string
	const acronymSubstrings = castValue
	.split("")
	.reduce<string[]>((previousSubstrings, currentCharacter) => {
		if (currentCharacter === currentCharacter.toLocaleUpperCase()) {
			return [ ...previousSubstrings, currentCharacter ]
		}
		const lastString = previousSubstrings.pop() || ""
		return [ ...previousSubstrings, lastString + currentCharacter ]
	}, [])

	const isAcronym = separatedSource.reduce<boolean>(
		(previousValidation, currentSource, i) => {
			const isValid = previousValidation && currentSource.startsWith(acronymSubstrings[i])
			return isValid
		},
		separatedSource.length === acronymSubstrings.length
	)

	if (isAcronym) {
		return state
	}

	const error = {
		"field": constraints.field,
		"friendlyName": constraints.friendlyName,
		"messageMaker": (field: string) => `Field "${field}" must be the proper acronym.`
	}

	throw error
}
