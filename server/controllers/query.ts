import type { Request } from "!/types/dependent"
import type { FieldRules } from "!/types/validation"

import Validation from "!/bases/validation"
import QueryValidation from "!/validations/query"
import Controller from "!/bases/controller-likes/controller"

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

	abstract makeQueryRuleGenerator(unusedRequest: Request): FieldRules
}
