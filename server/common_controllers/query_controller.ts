import type { Request } from "!/types/dependent"
import type { FieldRules } from "!/types/validation"

import Validation from "!/bases/validation"
import Controller from "!/bases/controller-likes/controller"
import QueryValidation from "!/validation/query"

/**
 * Specialized controller class which accept query as their input.
 */
export default abstract class extends Controller {
	get bodyParser(): null { return null }

	get validations(): Validation[] {
		return [
			new QueryValidation(
				this.makeQueryRuleGenerator.bind(this)
			)
		]
	}

	abstract makeQueryRuleGenerator(request: Request): FieldRules
}
