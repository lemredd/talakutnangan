import type { FieldRules, Pipe } from "!/types/validation"
import type { BaseManagerClass } from "!/types/independent"

import makeIDRules from "!/rule_sets/make_id"
import makeTypeRules from "!/rule_sets/make_type"
import makeDataDocumentRules from "!/rule_sets/make_data_document"

/**
 * Validates a submitted resource identifier.
 *
 * Automatically casts the IDs into integer.
 *
 * @param typeName Name of the type to expect
 * @param validator Pipe to use to validate the ID.
 * @param ClassName Manager class where to validate the ID if it exists
 * @param extraQueries If theare additional queries
 */
export default function(
	typeName: string,
	validator: Pipe,
	ClassName: BaseManagerClass,
	extraQueries: FieldRules = {}
): FieldRules {
	return {
		...makeIDRules(true, "id", {
			"constraints": {
				"manager": {
					"className": ClassName,
					"columnName": "id"
				}
			},
			"pipes": [ validator ]
		}),
		...makeTypeRules(typeName),
		...extraQueries
	}
}
