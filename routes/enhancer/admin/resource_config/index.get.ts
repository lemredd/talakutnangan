import type { Request, Response, NextFunction } from "!/types/dependent"

import Policy from "!/bases/policy"
import Validation from "!/bases/validation"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy { return CommonMiddlewareList.knownOnlyPolicy }

	get bodyParser(): null { return null }

	get validations(): Validation[] { return [] }

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		response.writeHead(this.status.MOVED_TEMPORARILY, {
			Location: "/admin/resource_config/users"
		})
		response.end()
	}
}
