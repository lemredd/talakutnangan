import type { BaseManagerClass } from "!/types/independent"
import type { FieldRules, Rules, Pipe } from "!/types/validation"

import makeDataDocumentRules from "!/rule_sets/make_data_document"
import makeResourceIdentifierRules from "!/rule_sets/make_resource_identifier"

/**
 * Validates a submitted resource document.
 *
 * @param typeName Name of the type to expect
 * @param validator Pipe to use to validate the ID.
 * @param ClassName Manager class where to validate the ID if it exists
 * @param options Optional arguments
 * @param options.postIDRules Additional rules for the ID.
 * @param options.mustCast If the ID in the identifier should be casted.
 * @param options.extraQueries If there are additional queries
 */
export default function(
	typeName: string,
	validator: Pipe,
	ClassName: BaseManagerClass,
	{
		postIDRules = { "pipes": [] },
		extraIdentifierQueries = {},
		extraQueries = {}
	}: Partial<{
		postIDRules: Rules
		extraIdentifierQueries: FieldRules
		extraQueries: FieldRules
	}> = {}
): FieldRules {
	return makeDataDocumentRules(
		false,
		makeResourceIdentifierRules(typeName, validator, ClassName, {
			"extraQueries": extraIdentifierQueries,
			"mustCastID": false,
			postIDRules
		}),
		extraQueries
	)
}
