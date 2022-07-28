import type { BaseManagerClass } from "!/types/independent"
import type { FieldRules } from "!/types/independent"

import object from "!/app/validators/base/object"
import string from "!/app/validators/base/string"
import integer from "!/app/validators/base/integer"
import nullable from "!/app/validators/base/nullable"
import range from "!/app/validators/comparison/range"
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
							nullable: { defaultValue: "exists" },
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
		},
		page: {
			pipes: [ nullable, object ],
			constraints: {
				nullable: { defaultValue: {} },
				object: {
					offset: {
						pipes: [ nullable, integer, range ],
						constraints: {
							nullable: { defaultValue: 0 },
							range: { minimum: 0 }
						}
					},
					limit: {
						pipes: [ nullable, integer, range ],
						constraints: {
							nullable: { defaultValue: process.env.DATABASE_MAX_SELECT || 10 },
							range: { minimum: 1 }
						}
					}
				}
			}
		}
	}
}
