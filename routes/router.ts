import Router from "!/bases/router"
import TestRouter from "!%/t/router"
import DevRouter from "!%/dev/router"
import { Environment } from "$/types/server"
import EnhancerRouter from "!%/enhancer/router"
import { controllers as APIControllers } from "!%/api/router"
import instantiateSimultaneously from "!/helpers/instantiate_simultaneously"

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(instantiateSimultaneously(APIControllers))

		this.useRoutersAsync(instantiateSimultaneously([
			EnhancerRouter
		]))

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
