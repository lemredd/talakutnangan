import type { BaseManagerClass } from "!/types/independent"
import type { FieldRules } from "!/types/independent"

import object from "!/app/validators/base/object"
import string from "!/app/validators/base/string"
import nullable from "!/app/validators/base/nullable"
import oneOf from "!/app/validators/comparison/one-of"
import stringArray from "!/app/validators/hybrid/string_array"

export default function(className: BaseManagerClass, extraFilters: FieldRules): FieldRules {
	return {
		filter: {
			pipes: [ nullable, object ],
			constraints: {
				nullable: { defaultValue: {} },
				object: {
					...extraFilters,
					existence: {
						pipes: [ nullable, string, oneOf ],
						constraints: {
							nullable: { defaultValue: "*" },
							oneOf: { values: [ "*", "exists", "archived" ] }
						}
					}
				}
			}
		},
		sort: {
			pipes: [ nullable, stringArray ],
			constraints: {
				nullable: { defaultValue: "id" },
				array: {
					rules: {
						pipes: [ string, oneOf ],
						constraints: {
							oneOf: {
								values: new className().sortableColumns
							}
						}
					}
				}
			}
		}
	}
}
