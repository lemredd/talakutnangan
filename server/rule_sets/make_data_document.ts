import type { FieldRules, RuleContraints } from "!/types/validation"

import array from "!/validators/base/array"
import object from "!/validators/base/object"
import required from "!/validators/base/required"
import length from "!/validators/comparison/length"

export default function(
	isObject: boolean,
	unitDataRules: FieldRules,
	extraQueries: FieldRules = {}
): FieldRules {
	const validators = isObject ? [ object ] : [ array, length ]
	const constraints: RuleContraints = isObject
		? { "object": unitDataRules }
		: {
			"array": {
				"constraints": {
					"object": unitDataRules
				},
				"pipes": [ required, object ]
			},
			"length": {
				// Maximum is possible to change in the future
				"maximum": 24,
				"minimum": 1
			}
		}

	return {
		"data": {
			"constraints": {
				...constraints
			},
			"pipes": [ required, ...validators ]
		},
		...extraQueries
	}
}
