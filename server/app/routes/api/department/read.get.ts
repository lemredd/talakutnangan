
import { Request, Response } from "!/types/dependent"

import Controller from "!/bases/controller"
import Middleware from "!/bases/middleware"
import DepartmentManager from "%/managers/department_manager"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default class extends Controller {
	get filePath(): string { return __filename }

	get middlewares(): Middleware[] {
		return [
			CommonMiddlewareList.knownOnlyPolicy,
			...super.middlewares
		]
	}

	async handle(request: Request, response: Response): Promise<void> {
		// TODO: Validate ID
		const { id } = request.body
		const manager = new DepartmentManager()
		const departmentInfo = await manager.findWithID(id)

		response.status(this.status.OK).json(departmentInfo)
	}
}
