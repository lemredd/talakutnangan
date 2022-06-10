import PageMiddleware from "!/bases/page_middleware"
import Middleware from "!/bases/middleware"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get middleware(): Middleware { return CommonMiddlewareList.knownOnlyPolicy }
}
