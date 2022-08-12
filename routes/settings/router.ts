import Router from "!/bases/router"
import GetIndex from "!%/settings/index.get"
import GetAccount from "!%/settings/account.get"
import GetProfile from "!%/settings/profile.get"

export default class extends Router {

	constructor() {
		super()

		this.useControllers([
			new GetIndex(),
			new GetAccount(),
			new GetProfile()
		])
	}
}
