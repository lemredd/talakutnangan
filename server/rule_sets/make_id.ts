import type { FieldRules, Rules } from "!/types/validation"

import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import required from "!/validators/base/required"

export default function(
	{
		mustCast = false,
		IDName = "id",
		postRules = { "pipes": [] }
	}: Partial<{
		mustCast: boolean
		IDName: string
		postRules: Rules
	}> = {}
): FieldRules {
	const additionalConstraints = postRules.constraints || {}
	const additionalPipes = postRules.pipes
	return {
		[IDName]: {
			"constraints": {
				"integer": { mustCast },
				...additionalConstraints
			},
			"pipes": [ required, string, integer, ...additionalPipes ]
		}
	}
}
