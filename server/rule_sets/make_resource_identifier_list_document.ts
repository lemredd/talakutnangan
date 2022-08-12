import type { FieldRules, Pipe } from "!/types/validation"
import type { BaseManagerClass } from "!/types/independent"

import makeDataDocumentRules from "!/rule_sets/make_data_document"
import makeIdentifierRules from "!/rule_sets/make_resource_identifier"

/**
 * Validates a submitted resource document.
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
	extraIdentifierQueries: FieldRules = {},
	extraQueries: FieldRules = {}
): FieldRules {
	return makeDataDocumentRules(
		false,
		makeIdentifierRules(typeName, validator, ClassName, extraIdentifierQueries),
		extraQueries
	)
}
