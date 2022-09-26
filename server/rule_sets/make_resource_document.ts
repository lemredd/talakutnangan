import type { FieldRules, Rules } from "!/types/validation"

import object from "!/validators/base/object"
import makeIDRules from "!/rule_sets/make_id"
import required from "!/validators/base/required"
import makeTypeRules from "!/rule_sets/make_type"
import makeDataDocumentRules from "!/rule_sets/make_data_document"

export default function(
	typeName: string,
	attributes: FieldRules,
	{
		isNew = false,
		mustCastID = false,
		postAttributeValidation = { "pipes": [] } as Rules,
		postIDRules = { "pipes": [] } as Rules,
		postDataRules = { "pipes": [] } as Rules,
		extraDataQueries = {} as FieldRules,
		extraQueries = {} as FieldRules
	}: Partial<{
		isNew: boolean
		mustCastID: boolean
		postAttributeValidation: Rules,
		postIDRules: Rules,
		extraDataQueries: FieldRules,
		postDataRules: Rules,
		extraQueries: FieldRules
	}> = {}
): FieldRules {
	return makeDataDocumentRules(true, {
		...isNew
			? {}
			: makeIDRules({
				"IDName": "id",
				"mustCast": mustCastID,
				"postRules": postIDRules
			}),
		...makeTypeRules(typeName),
		"attributes": {
			"constraints": {
				"object": attributes,
				...postAttributeValidation.constraints ?? {}
			},
			"pipes": [ required, object, ...postAttributeValidation.pipes ]
		},
		...extraDataQueries
	}, {
		extraQueries,
		postDataRules
	})
}
