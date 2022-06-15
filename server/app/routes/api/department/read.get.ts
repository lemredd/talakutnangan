import { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import DepartmentManager from "%/managers/department_manager"
import JSONController from "!/common_controllers/json_controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		// TODO: Use a permission-based policy
		return CommonMiddlewareList.knownOnlyPolicy
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
