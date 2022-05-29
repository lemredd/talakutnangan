import { RawRoute, RawURLInfo } from "!/types"
import Controller from "!/helpers/controller"
import Middleware from "!/helpers/middleware"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default abstract class extends Controller {
	abstract getRawURLInfo(): RawURLInfo

	getRawRoute(): RawRoute {
		return {
			method: "post",
			...this.getRawURLInfo()
		}
	}

	getPremiddlewares(): Middleware[] {
		return [
			...super.getPremiddlewares(),
			CommonMiddlewareList.guestPageGuard,
			CommonMiddlewareList.JSONBody
		]
	}
}
