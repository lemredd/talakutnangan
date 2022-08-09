import type { Request } from "!/types/dependent"
import type { FieldRules } from "!/types/validation"
import type { BaseManagerClass } from "!/types/independent"
import RouteParameterValidation from "!/validations/route_parameter"

import integer from "!/validators/base/integer"
import unique from "!/validators/manager/unique"
import required from "!/validators/base/required"

type ParameterInfo = [ string, BaseManagerClass ]

export default class extends RouteParameterValidation {
	constructor(IDs: ParameterInfo[]) {
		super((request: Request): FieldRules => IDs.reduce<FieldRules>(
			(previousValidationRules, info) => ({
				...previousValidationRules,
				[info[0]]: {
					pipes: [ required, integer, unique ],
					constraints: {
						manager: {
							className: info[1],
							columnName: "id"
						},
						unique: {
							IDPath: info[0]
						}
					}
				}
			}),
			{}
		))
	}
}
