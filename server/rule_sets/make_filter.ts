import type { FieldRules } from "!/types/validation"

import object from "!/validators/base/object"
import string from "!/validators/base/string"
import nullable from "!/validators/base/nullable"
import oneOf from "!/validators/comparison/one-of"

export default function(
	extraFilters: FieldRules,
	mustValidateDefaults = true
): FieldRules {
	const defaults: FieldRules = mustValidateDefaults
		? {
			"existence": {
				"constraints": {
					"nullable": { "defaultValue": "exists" },
					"oneOf": { "values": [ "*", "exists", "archived" ] }
				},
				"pipes": [ nullable, string, oneOf ]
			}
		}
		: {}
	return {
		"filter": {
			"constraints": {
				"nullable": { "defaultValue": {} },
				"object": {
					...defaults,
					...extraFilters
				}
			},
			"pipes": [ nullable, object ]
		}
	}
}
