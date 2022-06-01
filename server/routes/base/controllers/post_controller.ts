import { RawRoute, RawURLInfo } from "!/types"
import Controller from "!/routes/base/controller"

export default abstract class extends Controller {
	abstract getRawURLInfo(): RawURLInfo

	getRawRoute(): RawRoute {
		return {
			method: "post",
			...this.getRawURLInfo()
		}
	}
}
