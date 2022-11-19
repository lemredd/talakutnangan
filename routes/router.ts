import Router from "!/bases/router"
import TestRouter from "!%/t/router"
import DevRouter from "!%/dev/router"
import { Environment } from "$/types/server"
import RequestEnvironment from "$!/singletons/request_environment"

import { controllers as APIControllers } from "!%/api/router"
import { controllers as enhancerControllers } from "!%/enhancer/router"

import instantiateSimultaneously from "!/helpers/instantiate_simultaneously"

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(instantiateSimultaneously(RequestEnvironment.isInMaintenanceMode
			? [ ...enhancerControllers ]
			: [ ...APIControllers, ...enhancerControllers ]
		))

		switch (this.environment) {
			case Environment.Development:
				this.useRouter(new DevRouter())
				break
			case Environment.IntegrationTest:
				this.useRouter(new TestRouter())
				break
			default:
		}
	}
}
