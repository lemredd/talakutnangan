import type { FieldRules } from "!/types/validation"
import type { BaseManagerClass } from "!/types/dependent"

import object from "!/validators/base/object"
import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import nullable from "!/validators/base/nullable"
import range from "!/validators/comparison/range"
import oneOf from "!/validators/comparison/one-of"
import makeFilterRules from "!/rule_sets/make_filter"
import stringArray from "!/validators/hybrid/string_array"

export default function(
	ClassName: BaseManagerClass<any>,
	extraFilters: FieldRules,
	{
		defaultSortColumn = "id",
		extraQueries = {}
	}: Partial<{
		defaultSortColumn: string
		extraQueries: FieldRules
	}> = {}
): FieldRules {
	return {
		...makeFilterRules(extraFilters),
		"page": {
			"constraints": {
				"nullable": { "defaultValue": {} },
				"object": {
					"limit": {
						"constraints": {
							"integer": { "mustCast": true },
							"nullable": { "defaultValue": process.env.DATABASE_MAX_SELECT || 10 },
							"range": { "minimum": 1 }
						},
						"pipes": [ nullable, integer, range ]
					},
					"offset": {
						"constraints": {
							"integer": { "mustCast": true },
							"nullable": { "defaultValue": 0 },
							"range": { "minimum": 0 }
						},
						"pipes": [ nullable, integer, range ]
					}
				}
			},
			"pipes": [ nullable, object ]
		},
		"sort": {
			"constraints": {
				"array": {
					"constraints": {
						"oneOf": {
							"values": new ClassName().sortableColumns
						}
					},
					"pipes": [ string, oneOf ]
				},
				"nullable": { "defaultValue": defaultSortColumn }
			},
			"pipes": [ nullable, stringArray ]
		},
		...extraQueries
	}
}
