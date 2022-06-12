import { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import Validation from "!/bases/validation"
import Controller from "!/bases/controller-likes/controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default class extends Controller {
	get filePath(): string { return __filename }

	get policy(): Policy { return CommonMiddlewareList.guestOnlyPolicy }

	get bodyParser(): null { return null }

	get validations(): Validation[] { return [] }

	async handle(request: Request, response: Response): Promise<void> {
		response.status(this.status.UNAUTHORIZED)
	}
}
