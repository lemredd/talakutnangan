import { Request } from "!/types/dependent"
import type { BaseManagerClass } from "!/types/independent"
import RouteParameterValidation from "!/middlewares/validation/route_parameter"

type ParameterInfo = [ string, BaseManagerClass ]

export default class extends RouteParameterValidation {
	constructor(IDs: ParameterInfo[]) {
		super(IDs.reduce<{ [key:string]: any[] }>((previousValidationRules, info) => {
			return {
				...previousValidationRules,
				[info[0]]: [
					"required",
					"numeric",
					[
						"exists",
						info[1],
						"id"
					]
				]
			}
		}, {}))
	}

	getSubject(request: Request): object {
		return request.params
	}
}
