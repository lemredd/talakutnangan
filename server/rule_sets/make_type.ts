import type { FieldRules } from "!/types/validation"

import string from "!/validators/base/string"
import same from "!/validators/comparison/same"
import required from "!/validators/base/required"

export default function(typeName: string): FieldRules {
	return {
		"type": {
			"constraints": {
				"same": {
					"value": typeName
				}
			},
			"pipes": [ required, string, same ]
		}
	}
}
