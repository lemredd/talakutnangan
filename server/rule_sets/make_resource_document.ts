import type { FieldRules } from "!/types/validation"

import object from "!/validators/base/object"
import makeIDRules from "!/rule_sets/make_id"
import required from "!/validators/base/required"
import makeTypeRules from "!/rule_sets/make_type"

export default function(
	typeName: string,
	attributes: FieldRules,
	extraQueries: FieldRules = {}
): FieldRules {
	return {
		"data": {
			"constraints": {
				"nullable": { "defaultValue": {} },
				"object": {
					...makeIDRules("id"),
					...makeTypeRules(typeName),
					"attributes": {
						"constraints": {
							"object": attributes
						},
						"pipes": [ required, object ]
					}
				}
			},
			"pipes": [ required, object ]
		},
		...extraQueries
	}
}
