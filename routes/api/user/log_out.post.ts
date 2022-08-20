import type { AuthenticatedRequest } from "!/types/dependent"

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

	async handle(request: AuthenticatedRequest): Promise<NoContentResponseInfo> {
		return await new Promise<NoContentResponseInfo>(resolve => {
			// @ts-ignore
			request.logout((error: Error): void => {
				if (error) throw error
				// TODO: regenerate XSRF-Token or session

				resolve(new NoContentResponseInfo())
			})
		})
	}
}
