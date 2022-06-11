import { Request, Response } from "!/types/dependent"

import Middleware from "!/bases/middleware"
import JSONController from "!/bases/controller-likes/json_controller-like/controller"
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
		// TODO: Create custom validator for acronym
		return {
			acronym: [ "required", "string" ],
			fullName: [ "required", "string" ],
			mayAdmit: [ "required", "boolean" ]
		}
	}

	async handle(request: Request, response: Response): Promise<void> {
		const manager = new DepartmentManager()
		const departmentInfo = await manager.create(request.body)

		response.status(this.status.OK).json(departmentInfo)
	}
}
