import PageMiddleware from "!/bases/controller-like/page_middleware"
import Policy from "!/bases/policy"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy { return CommonMiddlewareList.knownOnlyPolicy }
}
