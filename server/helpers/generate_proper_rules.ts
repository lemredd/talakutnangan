import type { ValidationRules } from "!/types/independent"
import accessDeepPath from "$!/helpers/access_deep_path"

/**
 * Transforms the some keys with integer so deeply nested values can be validated.
 *
 * This is a workaround because validating through arrays do not work properly as expected when
 * there are asynchronous rules in nested properties.
 */
export default function(body: any, validationRules: ValidationRules): ValidationRules {
	const newValidationRules: ValidationRules = {}

	for (const notation in validationRules) {
		if (Object.prototype.hasOwnProperty.call(validationRules, notation)) {
			const rules = validationRules[notation];

			if (notation.includes(".*.")) {
				const pathParts = notation.split(".*.")
				const generatedKeys = new Set(makeKeys(body, [ pathParts.shift()! ], pathParts))

				for (const keys of generatedKeys) {
					newValidationRules[keys] = rules
				}
			} else {
				newValidationRules[notation] = rules
			}
		}
	}

	return newValidationRules
}

function makeKeys(body: any, generatedPaths: string[], pathParts: string[]): string[] {
	if (pathParts.length > 0) {
		const currentPathPart = pathParts.shift()
		const retainedPaths = []
		const newGeneratedPaths = []

		for (const generatedPath of generatedPaths) {
			const currentValue = accessDeepPath(body, generatedPath)

			if (currentValue instanceof Array) {
				for(let i = 0, limit = currentValue.length; i < limit; ++i) {
					newGeneratedPaths.push(`${generatedPath}.${i}.${currentPathPart}`)
				}
			} else {
				retainedPaths.push([
					generatedPath,
					currentPathPart,
					...pathParts
				].join(".*."))
			}
		}

		return [ ...makeKeys(body, newGeneratedPaths, pathParts), ...retainedPaths ]
	} else {
		return generatedPaths
	}
}
