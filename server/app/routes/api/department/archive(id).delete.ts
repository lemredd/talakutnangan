import { IDParameter, Request as BaseRequest, Response } from "!/types/dependent"

import Middleware from "!/bases/middleware"
import Controller from "!/bases/controller-like/controller"
import DepartmentManager from "%/managers/department_manager"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

interface WithID {
	params: IDParameter
}
export type Request = BaseRequest & WithID

export default class extends Controller {
	get filePath(): string { return __filename }

	get middlewares(): Middleware[] {
		return [
			CommonMiddlewareList.knownOnlyPolicy,
			...super.middlewares
		]
	}

	async handle(request: Request, response: Response): Promise<void> {
		const { id } = request.params
		const manager = new DepartmentManager()
		const deleteCount = await manager.archive(+id)

		response.status(deleteCount > 0? this.status.ACCEPTED : this.status.NOT_MODIFIED).end()
	}
}
