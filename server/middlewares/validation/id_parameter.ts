import { Request } from "!/types/dependent"
import BaseManager from "%/managers/base"
import RouteParameterValidation from "!/middlewares/validation/route_parameter"

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
