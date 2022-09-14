import type { Request } from "!/types/dependent"
import type { Rules, FieldRules, Pipe } from "!/types/validation"
import type { BaseManagerClass } from "!/types/dependent"

import integer from "!/validators/base/integer"
import required from "!/validators/base/required"
import RouteParameterValidation from "!/validations/route_parameter"

type ParameterInfo = [ string, BaseManagerClass, Pipe, Rules? ]

export default class extends RouteParameterValidation {
	constructor(IDs: ParameterInfo[]) {
		super((unusedRequest: Request): FieldRules => {
			const rules = IDs.reduce<FieldRules>(
				(previousValidationRules, info) => ({
					...previousValidationRules,
					[info[0]]: {
						"constraints": {
							"manager": {
								"className": info[1],
								"columnName": "id"
							},
							...info[3]?.constraints ?? {}
						},
						"friendlyName": info[3]?.friendlyName,
						"pipes": [ required, integer, info[2], ...info[3]?.pipes ?? [] ]
					}
				}),
				{}
			)

			return rules
		})
	}
}
