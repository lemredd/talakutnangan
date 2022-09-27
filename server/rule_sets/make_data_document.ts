import type { FieldRules, Rules, RuleContraints } from "!/types/validation"

import array from "!/validators/base/array"
import object from "!/validators/base/object"
import required from "!/validators/base/required"
import length from "!/validators/comparison/length"

export default function(
	isObject: boolean,
	unitDataRules: FieldRules,
	{
		extraQueries = {},
		postDataRules = { "pipes": [] }
	}: Partial<{
		extraQueries: FieldRules
		postDataRules: Rules
	}> = {}
): FieldRules {
	const postDataConstraints = postDataRules.constraints || {}
	const postDataPipes = postDataRules.pipes
	const constraints: RuleContraints = isObject
		? {
			"object": unitDataRules,
			...postDataConstraints
		}
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
			},
			...postDataConstraints
		}

	const validators = isObject ? [ object, ...postDataPipes ] : [ array, length, ...postDataPipes ]

	return {
		"data": {
			constraints,
			"pipes": [ required, ...validators ]
		},
		...extraQueries
	}
}
