import Router from "!/bases/router"
import ResourceConfigurationRouter from "!%/enhancer/admin/resource_config/router"

export default class extends Router {
	constructor() {
		super()

		this.useRouters([
			new ResourceConfigurationRouter()
		])
	}
}
