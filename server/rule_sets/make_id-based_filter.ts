import type { FieldRules } from "!/types/validation"
import type { BaseManagerClass } from "!/types/dependent"

import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import exists from "!/validators/manager/exists"
import nullable from "!/validators/base/nullable"
import required from "!/validators/base/required"
import skipAsterisk from "!/validators/comparison/skip_asterisk"

export default function(
	fieldName: string,
	ClassName: BaseManagerClass,
	{
		maySkip = true,
		mustCast = false,
		defaultValue = "*",
		mayConsiderEmptyStringAsNull = false,
		mustSkipAfterSettingDefault = false
	}: Partial<{
		maySkip: boolean
		mustCast: boolean,
		defaultValue: any,
		mayConsiderEmptyStringAsNull: boolean
		mustSkipAfterSettingDefault: boolean
	}> = {}
): FieldRules {
	const fieldRequirement = maySkip
		? [ nullable, skipAsterisk ]
		: [ required ]
	return {
		[fieldName]: {
			"constraints": {
				"integer": { mustCast },
				"manager": {
					"className": ClassName,
					"columnName": "id"
				},
				"nullable": {
					defaultValue,
					mayConsiderEmptyStringAsNull,
					mustSkipAfterSettingDefault
				}
			},
			"pipes": [ ...fieldRequirement, string, integer, exists ]
		}
	}
}
