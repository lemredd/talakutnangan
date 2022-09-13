import type { BaseManagerClass } from "!/types/dependent"
import type { FieldRules, Rules, Pipe } from "!/types/validation"

import makeIDRules from "!/rule_sets/make_id"
import makeTypeRules from "!/rule_sets/make_type"

/**
 * Validates a submitted resource identifier.
 *
 * @param typeName Name of the type to expect
 * @param validator Pipe to use to validate the ID.
 * @param ClassName Manager class where to validate the ID if it exists
 * @param options Optional arguments
 * @param options.mustCast If the ID in the identifier should be casted.
 * @param options.extraQueries If there are additional queries
 */
export default function(
	typeName: string,
	validator: Pipe,
	ClassName: BaseManagerClass,
	{
		mustCastID = false,
		postIDRules = { "pipes": [] },
		extraQueries = {}
	}: Partial<{
		mustCastID: boolean,
		postIDRules: Rules,
		extraQueries: FieldRules
	}> = {}
): FieldRules {
	const postIDConstraints = postIDRules.constraints || {}
	const postIDPipes = postIDRules.pipes
	return {
		...makeIDRules({
			"IDName": "id",
			"mustCast": mustCastID,
			"postRules": {
				"constraints": {
					"manager": {
						"className": ClassName,
						"columnName": "id"
					},
					...postIDConstraints
				},
				"pipes": [ validator, ...postIDPipes ]
			}
		}),
		...makeTypeRules(typeName),
		...extraQueries
	}
}
