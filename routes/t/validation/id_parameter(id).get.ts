import type { Request, Response } from "!/types/dependent"

import Validation from "!/bases/validation"
import UserManager from "%/managers/user"
import Controller from "!/bases/controller-likes/controller"
import IDParameterValidation from "!/validation/id_parameter"

export default class extends Controller {
	get filePath(): string { return __filename }

	get policy(): null { return null }

	get bodyParser(): null { return null }

	get validations(): Validation[] {
		return [
			new IDParameterValidation([
				[ "id", UserManager ]
			])
		]
	}

	async handle(request: Request, response: Response): Promise<void> {
		response.status(this.status.OK)
	}
}
