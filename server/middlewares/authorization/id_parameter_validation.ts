import { Request } from "!/types/dependent"
import BaseManager from "%/managers/base"
import RouteParameterValidation from "!/middlewares/authorization/route_parameter_validation"

type ParameterInfo = [ string, new() => BaseManager<any, any> ]

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
