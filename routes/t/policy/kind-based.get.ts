import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import QueryController from "!/controllers/query_controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return CommonMiddlewareList.studentOnlyPolicy
	}

	makeQueryRuleGenerator(unusedRequest: Request): FieldRules {
		return {}
	}

	async handle(request: Request, response: Response): Promise<void> {
		response.status(this.status.OK)
	}
}
