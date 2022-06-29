import type { Validator } from "node-input-validator"

/**
 * Function to validate the input acronyms.
 *
 * It requires a field of the source to determine if the acronym is invalid. Therefore, it is
 * recommended to have rules `required` and `minlength:2`.
 */
export default function({ value, args }: { value: string, args: string[] }, validator: Validator) {
	if (args.length < 1) {
		throw new Error("Missing source field to validate the acronym.")
	}

	const fieldName = args[0]
	const source: string = validator.inputs[fieldName]

	const separatedSource = source
		.split(" ")
		.filter(word => word.slice(0, 1) === word.slice(0, 1).toLocaleUpperCase())
	const acronymSubstrings = value
		.split("")
		.reduce<string[]>((previousSubstrings, currentCharacter) => {
			if(currentCharacter === currentCharacter.toLocaleUpperCase()) {
				return [ ...previousSubstrings, currentCharacter ]
			} else {
				const lastString = previousSubstrings.pop() || ""
				return [ ...previousSubstrings, lastString+currentCharacter ]
			}
		}, [])

	return separatedSource.reduce<boolean>((previousValidation, currentSource, i) => {
		return previousValidation && currentSource.startsWith(acronymSubstrings[i])
	}, true)
}