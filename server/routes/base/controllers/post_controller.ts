import { RawRoute, RawURLInfo } from "!/types"
import Controller from "!/routes/base/controller"
import Middleware from "!/routes/base/middleware"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default abstract class extends Controller {
	abstract getRawURLInfo(): RawURLInfo

	getRawRoute(): RawRoute {
		return {
			method: "post",
			...this.getRawURLInfo()
		}
	}
}
