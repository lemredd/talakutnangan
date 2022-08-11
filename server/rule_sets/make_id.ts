import type { FieldRules } from "!/types/validation"

import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import required from "!/validators/base/required"

export default function(mustCast = false, IDName = "id"): FieldRules {
	return {
		[IDName]: {
			"constraints": {
				"integer": { mustCast }
			},
			"pipes": [ required, string, integer ]
		}
	}
}
