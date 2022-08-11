import type { FieldRules } from "!/types/validation"

import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import required from "!/validators/base/required"

export default function(IDName = "id"): FieldRules {
	return {
		[IDName]: {
			"pipes": [ required, string, integer ]
		}
	}
}
