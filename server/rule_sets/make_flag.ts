import type { FieldRules } from "!/types/validation"

import BasePermission from "$/permissions/base"
import integer from "!/validators/base/integer"
import range from "!/validators/comparison/range"
import required from "!/validators/base/required"

export default function(flagName: string, basePermission: BasePermission<any, any>): FieldRules {
	return {
		[flagName]: {
			"constraints": {
				"range": {
					"maximum": basePermission.generateSuperMask(),
					"minimum": 0
				}
			},
			"pipes": [ required, integer, range ]
		}
	}
}
