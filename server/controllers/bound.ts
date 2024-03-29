import type { Rules, Pipe } from "!/types/validation"
import type { BaseManagerClass } from "!/types/dependent"
import type { OptionalMiddleware } from "!/types/independent"

import Validation from "!/bases/validation"
import present from "!/validators/manager/present"
import Controller from "!/bases/controller-likes/controller"
import IDParameterValidation from "!/validations/id_parameter"

/**
 * Specialized controller class which:
 * - Requires ID parameter to match an existing model in the database
 */
export default abstract class extends Controller {
	get bodyParser(): OptionalMiddleware { return null }

	get validations(): Validation[] {
		return [
			new IDParameterValidation([
				[ "id", this.manager, this.boundPipe, this.extraIDParameterValidation ]
			]),
			...this.postBoundValidations
		]
	}

	abstract get manager(): BaseManagerClass

	protected get boundPipe(): Pipe { return present }

	protected get extraIDParameterValidation(): Rules {
		return { "pipes": [] }
	}

	protected get postBoundValidations(): Validation[] {
		return []
	}
}
