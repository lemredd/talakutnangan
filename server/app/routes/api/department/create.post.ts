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
		// TODO: Think of the minimum length of full name.
		return {
			fullName: [ "required", "string", "minLength:10", "regex:([A-Z][a-z]+ )+[A-Z][a-z]+$" ],
			acronym: [
				"required",
				"string",
				"minLength:2",
				"regex:([A-Z][a-z]*)+",
				"acronym:fullName"
			],
			mayAdmit: [ "required", "boolean" ]
		}
	}

	async handle(request: Request, response: Response): Promise<void> {
		const manager = new DepartmentManager()
		const departmentInfo = await manager.create(request.body)

		response.status(this.status.OK).json(departmentInfo)
	}
}
