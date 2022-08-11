import type { FieldRules } from "!/types/validation"

import object from "!/validators/base/object"
import makeIDRules from "!/rule_sets/make_id"
import required from "!/validators/base/required"
import makeTypeRules from "!/rule_sets/make_type"
import makeDataDocumentRules from "!/rule_sets/make_data_document"

export default function(
	typeName: string,
	attributes: FieldRules,
	isNew = false,
	mustCastID = false,
	extraDataQueries: FieldRules = {},
	extraQueries: FieldRules = {}
): FieldRules {
	return makeDataDocumentRules(true, {
		...isNew ? {} : makeIDRules(mustCastID, "id"),
		...makeTypeRules(typeName),
		"attributes": {
			"constraints": {
				"object": attributes
			},
			"pipes": [ required, object ]
		},
		...extraDataQueries
	}, extraQueries)
}