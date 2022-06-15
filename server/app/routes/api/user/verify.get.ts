import { Request as BaseRequest, Response, Query } from "!/types/dependent"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import QueryController from "!/common_controllers/query_controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

interface RequiredQuery extends Query {
	to: string
}

interface WithQuery {
	query: RequiredQuery
}

type Request = BaseRequest & WithQuery

// TODO: Make this as a page middleware
export default class extends QueryController {
	get filePath(): string { return __filename }

	// TODO: Base the policy from permission
	get policy(): Policy { return CommonMiddlewareList.knownOnlyPolicy }

	get queryValidationRules(): object {
		return {
			to: ["required", "email"]
		}
	}

	async handle(request: Request, response: Response): Promise<void> {
		const { to } = request.query
		const manager = new UserManager()
		const verifiedCount = await manager.verify(to)

		response.status(verifiedCount > 0 ? this.status.ACCEPTED : this.status.NOT_MODIFIED)
	}
}
