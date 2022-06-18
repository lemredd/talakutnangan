import { AuthenticatedIDRequest, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import DepartmentManager from "%/managers/department"
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
		const deleteCount = await manager.archive(+id)

		response.status(deleteCount > 0? this.status.NO_CONTENT : this.status.NOT_MODIFIED)
	}
}
