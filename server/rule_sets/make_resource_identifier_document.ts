import type { FieldRules, Pipe } from "!/types/validation"
import type { BaseManagerClass } from "!/types/independent"

import makeDataDocumentRules from "!/rule_sets/make_data_document"
import makeResourceIdentifierRules from "!/rule_sets/make_resource_identifier"

/**
 * Validates a submitted resource identifier document.
 *
 * @param typeName Name of the type to expect
 * @param validator Pipe to use to validate the ID.
 * @param ClassName Manager class where to validate the ID if it exists
 * @param options Optional values
 */
export default function(
	typeName: string,
	validator: Pipe,
	ClassName: BaseManagerClass,
	extraIdentifierQueries: FieldRules = {},
	extraQueries: FieldRules = {}
): FieldRules {
	return makeDataDocumentRules(
		true,
		makeResourceIdentifierRules(typeName, validator, ClassName, {
			"extraQueries": extraIdentifierQueries,
			"mustCastID": false
		}),
		extraQueries
	)
}
