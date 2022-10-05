import type { BaseManagerClass } from "!/types/dependent"
import type { Pipe, Rules, FieldRules } from "!/types/validation"

import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import exists from "!/validators/manager/exists"
import nullable from "!/validators/base/nullable"
import length from "!/validators/comparison/length"
import stringArray from "!/validators/hybrid/string_array"

export default function(
	ClassName: BaseManagerClass,
	{
		postIDRules = { "pipes": [] },
		initialPipes = [ nullable ],
		multipleIDKey = "IDs",
		mustCast = false
	}: Partial<{
		postIDRules: Rules,
		initialPipes: Pipe[],
		multipleIDKey: string,
		mustCast: boolean
	}> = {}
): FieldRules {
	const postIDConstraints = postIDRules.constraints || {}
	const postIDPipes = postIDRules.pipes

	return {
		[multipleIDKey]: {
			"constraints": {
				"array": {
					"constraints": {
						"integer": { mustCast },
						"manager": {
							"className": ClassName,
							"columnName": "id"
						},
						...postIDConstraints
					},
					"pipes": [ string, integer, exists, ...postIDPipes ]
				},
				"length": {
					// TODO: Find the best length
					"maximum": 24,
					"minimum": 1
				}
			},
			"pipes": [ ...initialPipes, stringArray, length ]
		}
	}
}
