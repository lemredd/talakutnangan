import type {
	ValidationState,
	ValidationConstraints,
	AcronymRuleConstraints
} from "!/types/validation"

import accessDeepPath from "$!/helpers/access_deep_path"
import makeDeveloperError from "!/app/validators/make_developer_error"

/**
 * Validator to check if data is the proper acronym of the other field
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<AcronymRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if(state.maySkip) return state

	if (constraints.acronym === undefined) {
		throw makeDeveloperError(constraints.field)
	}

	const source: string = accessDeepPath(constraints.source, constraints.acronym.spelledOutPath)

	const separatedSource = source
		.split(" ")
		.filter(word => word.slice(0, 1) === word.slice(0, 1).toLocaleUpperCase())
	const acronymSubstrings = (state.value as string)
		.split("")
		.reduce<string[]>((previousSubstrings, currentCharacter) => {
			if(currentCharacter === currentCharacter.toLocaleUpperCase()) {
				return [ ...previousSubstrings, currentCharacter ]
			} else {
				const lastString = previousSubstrings.pop() || ""
				return [ ...previousSubstrings, lastString+currentCharacter ]
			}
		}, [])

	const isAcronym = separatedSource.reduce<boolean>((previousValidation, currentSource, i) => {
		return previousValidation && currentSource.startsWith(acronymSubstrings[i])
	}, separatedSource.length === acronymSubstrings.length)

	if (isAcronym) {
		return state
	} else {
		throw {
			field: constraints.field,
			messageMaker: (field: string) => `Field "${field}" must be the proper acronym.`
		}
	}
}
