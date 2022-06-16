import { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import DepartmentManager from "%/managers/department"
import JSONController from "!/common_controllers/json_controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		// TODO: Use a permission-based policy
		return CommonMiddlewareList.knownOnlyPolicy
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
