import { Request, Response } from "!/types/dependent"

import Middleware from "!/bases/middleware"
import JSONController from "!/bases/controllers/json_controller"
import DepartmentManager from "%/managers/department_manager"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get middlewares(): Middleware[] {
		return [
			CommonMiddlewareList.knownOnlyPolicy,
			...super.middlewares
		]
	}

	get bodyValidationRules(): object {
		return {
			id: [ "required", "numeric", "min:1" ]
		}
	}

	async handle(request: Request, response: Response): Promise<void> {
		const { id } = request.body
		const manager = new DepartmentManager()
		const departmentInfo = await manager.findWithID(id)

		response.status(this.status.OK).json(departmentInfo)
	}
}
