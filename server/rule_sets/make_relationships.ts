import type { FieldRules, Rules } from "!/types/validation"

import object from "!/validators/base/object"
import required from "!/validators/base/required"

export default function(
	relationships: FieldRules,
	{
		postRelationshipValidation = { "pipes": [] } as Rules
	}: Partial<{
		postRelationshipValidation: Rules
	}> = {}
): FieldRules {
	return {
		"relationships": {
			"constraints": {
				"object": relationships,
				...postRelationshipValidation.constraints ?? {}
			},
			"pipes": [ required, object, ...postRelationshipValidation.pipes ]
		}
	}
}
