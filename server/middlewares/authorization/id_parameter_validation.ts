import { Request } from "!/types/dependent"
import RouteParameterValidation from "!/middlewares/authorization/route_parameter_validation"

export default class extends RouteParameterValidation {
	constructor() {
		super({
			id: ["required", "numeric"]
		})
	}

	getSubject(request: Request): object {
		return request.params
	}
}
