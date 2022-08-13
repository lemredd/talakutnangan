import type { Pipe } from "!/types/validation"
import type { BaseManagerClass } from "!/types/independent"

import Validation from "!/bases/validation"
import present from "!/validators/manager/present"
import Controller from "!/bases/controller-likes/controller"
import IDParameterValidation from "!/validations/id_parameter"

/**
 * Specialized controller class which requires ID parameter to match an present model in the
 * database.
 */
export default abstract class extends Controller {
	get validations(): Validation[] {
		return [
			new IDParameterValidation([
				[ "id", this.manager, this.boundPipe ]
			]),
			...this.postBoundValidations
		]
	}

	abstract get manager(): BaseManagerClass

	protected get boundPipe(): Pipe { return present }

	protected get postBoundValidations(): Validation[] {
		return []
	}
}
