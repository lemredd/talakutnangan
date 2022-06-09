import { IDParameter, Request as BaseRequest, Response } from "!/types/dependent"

import Middleware from "!/bases/middleware"
import DepartmentManager from "%/managers/department_manager"
import JSONController from "!/bases/controllers/json_controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

interface WithID {
	params: IDParameter
}
export type Request = BaseRequest & WithID

export default class extends JSONController {
	get filePath(): string { return __filename }

	get middlewares(): Middleware[] {
		return [
			CommonMiddlewareList.knownOnlyPolicy,
			...super.middlewares
		]
	}

	get validationRules(): object {
		// TODO: Create custom validator for acronym
		return {
			acronym: [ "string" ],
			fullName: [ "string" ],
			mayAdmit: [ "boolean" ],
			"*": "any:acronym,fullName,mayAdmit"
		}
	}

	async handle(request: Request, response: Response): Promise<void> {
		const { id } = request.params
		const manager = new DepartmentManager()
		const departmentInfo = await manager.update(+id, request.body)

		response.status(this.status.OK).json(departmentInfo)
	}
}
