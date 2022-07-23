import type { AuthenticatedRequest, Response }  from "!/types/dependent"

import Policy from "!/bases/policy"
import Validation from "!/bases/validation"
import Controller from "!/bases/controller-likes/controller"
import NoContentResponseInfo from "!/response_infos/no_content"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default class extends Controller {
	get filePath(): string { return __filename }

	get policy(): Policy { return CommonMiddlewareList.knownOnlyPolicy }

	get bodyParser(): null { return null }

	get validations(): Validation[] { return [] }

	async handle(request: AuthenticatedRequest, response: Response): Promise<NoContentResponseInfo> {
		request.logout()

		// TODO: regenerate XSRF-Token or session

		return new NoContentResponseInfo()
	}
}
