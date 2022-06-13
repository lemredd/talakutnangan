import { AuthenticatedIDRequest, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import DepartmentManager from "%/managers/department_manager"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import ModelBoundController from "!/common_controllers/model_bound_controller"

export default class extends ModelBoundController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		// TODO: Use a permission-based policy
		return CommonMiddlewareList.knownOnlyPolicy
	}

	async handle(request: AuthenticatedIDRequest, response: Response): Promise<void> {
		const { id } = request.params
		const manager = new DepartmentManager()
		await manager.restore(+id)

		response.status(this.status.NO_CONTENT)
	}
}
