import type { FieldRules } from "!/types/validation"
import type { BaseManagerClass } from "!/types/independent"

import makeIDRules from "!/rule_sets/make_id"
import exists from "!/validators/manager/exists"
import makeTypeRules from "!/rule_sets/make_type"
import makeDataDocumentRules from "!/rule_sets/make_data_document"

/**
 * Validates a submitted resource document.
 *
 * Automatically casts the IDs into integer.
 *
 * @param typeName Name of the type to expect
 * @param ClassName Manager class where to validate the ID if it exists
 * @param extraQueries If theare additional queries
 */
export default function(
	typeName: string,
	ClassName: BaseManagerClass,
	extraQueries: FieldRules = {}
): FieldRules {
	return makeDataDocumentRules(false, {
		...makeIDRules(true, "id", {
			"constraints": {
				"manager": {
					"className": ClassName,
					"columnName": "id"
				}
			},
			"pipes": [ exists ]
		}),
		...makeTypeRules(typeName)
	}, extraQueries)
}
