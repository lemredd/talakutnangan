import { v4 } from "uuid"

import { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import Validation from "!/bases/validation"
import Controller from "!/bases/controller-likes/controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default class extends Controller {
	get filePath(): string { return __filename }

	get policy(): Policy { return CommonMiddlewareList.knownOnlyPolicy }

	get bodyParser(): null { return null }

	get validations(): Validation[] { return [] }

	async handle(request: Request, response: Response): Promise<void> {
		response.writeHead(this.status.MOVED_TEMPORARILY, {
			Location: `/chat/room/${v4()}`
		})
	}
}
