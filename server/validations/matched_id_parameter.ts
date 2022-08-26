import type { Request } from "!/types/dependent"
import type { FieldRules } from "!/types/validation"

import Validation from "!/bases/validation"
import object from "!/validators/base/object"
import makeIDRules from "!/rule_sets/make_id"
import same from "!/validators/comparison/same"
import required from "!/validators/base/required"
import makeDataDocumentRules from "!/rule_sets/make_data_document"

export default class extends Validation {
	constructor() {
		super((unusedRequest: Request): FieldRules => ({
			"body": {
				"constraints": {
					"object": makeDataDocumentRules(true, makeIDRules({
						"IDName": "id",
						"mustCast": true,
						"postRules": {
							"constraints": {
								"same": {
									"pointer": "params.id"
								}
							},
							"pipes": [ same ]
						}
					}))
				},
				"pipes": [ required, object ]
			},
			"params": {
				"constraints": {
					"object": makeIDRules()
				},
				"pipes": [ required, object ]
			}
		}))
	}

	getSubject(request: Request): object {
		return {
			"body": request.body,
			"params": request.params
		}
	}
}
