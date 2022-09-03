import type { Request } from "!/types/dependent"
import type { FieldRules, Pipe } from "!/types/validation"
import type { BaseManagerClass } from "!/types/independent"

import integer from "!/validators/base/integer"
import required from "!/validators/base/required"
import RouteParameterValidation from "!/validations/route_parameter"

type ParameterInfo = [ string, BaseManagerClass, Pipe ]

export default class extends RouteParameterValidation {
	constructor(IDs: ParameterInfo[]) {
		super((request: Request): FieldRules => {
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
						"pipes": [ required, integer, info[2] ]
					}
				}),
				{}
			)
		})
	}
}
