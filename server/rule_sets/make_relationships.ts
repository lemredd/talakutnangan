import type { Relationship } from "!/types/rule_set"
import type { FieldRules, Rules } from "!/types/validation"

import object from "!/validators/base/object"
import required from "!/validators/base/required"
import makeResourceIdentifierDocumentRules from "!/rule_sets/make_resource_identifier_document"
import makeResourceIdentifierListDocumentRules
	from "!/rule_sets/make_resource_identifier_list_document"

export default function(
	relationships: Relationship[],
	{
		postRelationshipValidation = { "pipes": [] } as Rules
	}: Partial<{
		postRelationshipValidation: Rules
	}> = {}
): FieldRules {
	return {
		"relationships": {
			"constraints": {
				"object": relationships.map(relationship => {
					const {
						isArray,
						typeName,
						validator,
						ClassName,
						options
					} = relationship
					if (isArray) {
						return makeResourceIdentifierDocumentRules(
							typeName,
							validator,
							ClassName,
							options ?? {}
						)
					}

					return makeResourceIdentifierListDocumentRules(
						typeName,
						validator,
						ClassName,
						options ?? {}
					)
				}).reduce((previousFields, currentField) => ({
					...previousFields,
					...currentField
				}), {}),
				...postRelationshipValidation.constraints ?? {}
			},
			"pipes": [ required, object, ...postRelationshipValidation.pipes ]
		}
	}
}
