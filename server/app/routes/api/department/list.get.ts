import { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import DepartmentManager from "%/managers/department"
import QueryController from "!/common_controllers/query_controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"


export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		// TODO: Use permission-based policy
		return CommonMiddlewareList.knownOnlyPolicy
	}

	get queryValidationRules(): object {
		// TODO: Validate common query
		return {}
	}

	async handle(request: Request, response: Response): Promise<void> {
		// TODO: Add limit to the constraints
		const constraints = { ...request.query }

		const manager = new DepartmentManager()
		const departments = await manager.list(constraints)

		response.status(this.status.OK).json(departments)
	}
}
