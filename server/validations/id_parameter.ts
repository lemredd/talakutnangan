import type { Request } from "!/types/dependent"
import type { FieldRules, Pipe } from "!/types/validation"
import type { BaseManagerClass } from "!/types/independent"

import Log from "$!/singletons/log"
import integer from "!/validators/base/integer"
import required from "!/validators/base/required"
import present from "!/validators/manager/present"
import RouteParameterValidation from "!/validations/route_parameter"

type ParameterInfo = [ string, BaseManagerClass, Pipe? ]

export default class extends RouteParameterValidation {
	constructor(IDs: ParameterInfo[]) {
		super((request: Request): FieldRules => {
			if (IDs.reduce((previousAssertion, info) => previousAssertion || !info[2], false)) {
				Log.warn("validation", `Parameter info validator should be provided in ${request.url}.`)
			}

			return IDs.reduce<FieldRules>(
				(previousValidationRules, info) => ({
					...previousValidationRules,
					[info[0]]: {
						"constraints": {
							"manager": {
								"className": info[1],
								"columnName": "id"
							}
						},
						"pipes": [ required, integer, info[2] || present ]
					}
				}),
				{}
			)
		})
	}
}
