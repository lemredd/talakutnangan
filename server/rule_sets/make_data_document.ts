import type { FieldRules, RuleContraints } from "!/types/validation"

import array from "!/validators/base/array"
import object from "!/validators/base/object"
import required from "!/validators/base/required"

export default function(
	isObject: boolean,
	unitDataRules: FieldRules,
	extraQueries: FieldRules = {}
): FieldRules {
	const validator = isObject ? object : array
	const constraints: RuleContraints = isObject
		? {
			"object": unitDataRules
		}
		: {
			"array": {
				"constraints": {
					"object": unitDataRules
				},
				"pipes": [ required, object ]
			}
		}

	return {
		"data": {
			"constraints": {
				"nullable": { "defaultValue": {} },
				...constraints
			},
			"pipes": [ required, validator ]
		},
		...extraQueries
	}
}
