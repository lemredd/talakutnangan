import Enhancer from "!/bases/enhancer"
import Middleware from "!/bases/middleware"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default class extends Enhancer {
	get filePath(): string { return __filename }

	get middleware(): Middleware { return CommonMiddlewareList.knownOnlyPolicy }
}
