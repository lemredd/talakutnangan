import type { FieldRules, Rules } from "!/types/validation"

import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import required from "!/validators/base/required"

export default function(
	mustCast = false,
	IDName = "id",
	additionalRules: Rules = { "pipes": [] }
): FieldRules {
	const additionalConstraints = additionalRules.constraints || {}
	const additionalPipes = additionalRules.pipes
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
