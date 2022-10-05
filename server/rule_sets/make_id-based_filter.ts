import type { FieldRules } from "!/types/validation"
import type { BaseManagerClass } from "!/types/dependent"

import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import exists from "!/validators/manager/exists"
import nullable from "!/validators/base/nullable"
import skipAsterisk from "!/validators/comparison/skip_asterisk"

export default function(
	fieldName: string,
	ClassName: BaseManagerClass,
	{
		mustCast = false
	}: Partial<{
		mustCast: boolean
	}> = {}
): FieldRules {
	return {
		[fieldName]: {
			"constraints": {
				"integer": { mustCast },
				"manager": {
					"className": ClassName,
					"columnName": "id"
				},
				"nullable": { "defaultValue": "*" }
			},
			"pipes": [ nullable, skipAsterisk, string, integer, exists ]
		}
	}
}
