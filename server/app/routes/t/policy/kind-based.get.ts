import type { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import QueryController from "!/common_controllers/query_controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return CommonMiddlewareList.studentOnlyPolicy
	}

	get queryValidationRules(): object {
		return {}
	}

	async handle(request: Request, response: Response): Promise<void> {
		response.status(this.status.OK)
	}
}