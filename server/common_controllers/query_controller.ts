import type { FieldRulesMaker } from "!/types/hybrid"

import Validation from "!/bases/validation"
import Controller from "!/bases/controller-likes/controller"
import QueryValidation from "!/middlewares/validation/query"

/**
 * Specialized controller class which accept query as their input.
 */
export default abstract class extends Controller {
	get bodyParser(): null { return null }

	get validations(): Validation[] {
		return [
			new QueryValidation(
				this.makeQueryRuleGenerator()
				|| this.queryValidationRules
			)
		]
	}

	makeQueryRuleGenerator(): FieldRulesMaker|null { return null }

	abstract get queryValidationRules(): object;
}
