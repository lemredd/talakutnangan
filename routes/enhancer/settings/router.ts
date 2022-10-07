import Router from "!/bases/router"
import GetIndex from "!%/enhancer/settings/index.get"
import GetAccount from "!%/enhancer/settings/account.get"
import GetProfile from "!%/enhancer/settings/profile.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new GetIndex(),
				new GetAccount(),
				new GetProfile()
			])
		}))
	}
}
