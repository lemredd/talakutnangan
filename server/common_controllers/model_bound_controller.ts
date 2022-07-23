import type { BaseManagerClass } from "!/types/independent"

import Log from "$!/singletons/log"
import Validation from "!/bases/validation"
import BoundController from "!/common_controllers/bound_controller"
import RouteParamterValidation from "!/middlewares/validation/route_parameter"

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
		const rules: any[] = [ "required", "numeric" ]

		if(this.manager === null) {
			Log.errorMessage(
				"controller",
				"There is no manager provided to validate if the ID exists in database"
			)
		} else {
			rules.push([ "exists", this.manager, "id" ])
		}

		return {
			id: rules
		}
	}

	get manager(): BaseManagerClass|null {
		return null
	}
}
