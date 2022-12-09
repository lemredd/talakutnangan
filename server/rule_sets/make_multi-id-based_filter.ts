import type { BaseManagerClass } from "!/types/dependent"
import type { Pipe, RuleContraints, Rules, FieldRules } from "!/types/validation"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

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
		initialConstraints = {},
		multipleIDKey = "IDs",
		mustCast = false
	}: Partial<{
		postIDRules: Rules,
		initialPipes: Pipe[],
		initialConstraints: RuleContraints,
		multipleIDKey: string,
		mustCast: boolean
	}> = {}
): FieldRules {
	const postIDConstraints = postIDRules.constraints || {}
	const postIDPipes = postIDRules.pipes

	return {
		[multipleIDKey]: {
			"constraints": {
				...initialConstraints,
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
					"maximum": DEFAULT_LIST_LIMIT,
					"minimum": 1
				}
			},
			"pipes": [ ...initialPipes, stringArray, length ]
		}
	}
}
