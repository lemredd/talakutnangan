import Validation from "!/bases/validation"
import Controller from "!/bases/controller-likes/controller"
import RouteParamterValidation from "!/middlewares/validation/route_parameter"

/**
 * Specialized controller class which is binded to route parameter(s).
 */
export default abstract class extends Controller {
	get bodyParser(): null { return null }

	get validations(): Validation[] {
		return [
			new RouteParamterValidation(this.routeParameterValidationRules)
		]
	}

	abstract get routeParameterValidationRules(): object;
}
