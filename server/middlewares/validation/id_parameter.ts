import type { Request } from "!/types/dependent"
import type { FieldRules } from "!/types/validation"
import type { BaseManagerClass } from "!/types/independent"
import RouteParameterValidation from "!/middlewares/validation/route_parameter"

import integer from "!/app/validators/base/integer"
import exists from "!/app/validators/manager/exists"
import required from "!/app/validators/base/required"

type ParameterInfo = [ string, BaseManagerClass ]

export default class extends RouteParameterValidation {
	constructor(IDs: ParameterInfo[]) {
		super((request: Request): FieldRules => IDs.reduce<FieldRules>(
			(previousValidationRules, info) => ({
				...previousValidationRules,
				[info[0]]: {
					pipes: [ required, integer, exists ],
					constraints: {
						manager: {
							className: info[1],
							columnName: "id"
						}
					}
				}
			}),
			{}
		))
	}
}
