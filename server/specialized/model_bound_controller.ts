import Validation from "!/bases/validation"
import BoundController from "!/specialized/bound_controller"
import RouteParamterValidation from "!/middlewares/authorization/route_parameter_validation"

/**
 * Specialized controller class expects the route to have a ID route parameter.
 */
export default abstract class extends BoundController {
	get bodyParser(): null { return null }

	get validations(): Validation[] {
		return [
			new RouteParamterValidation(this.routeParameterValidationRules)
		]
	}

	get routeParameterValidationRules(): object {
		return {
			id: ["required", "numeric"]
		}
	}
}
