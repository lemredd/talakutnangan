import Router from "!/bases/router"
import TestRouter from "!%/t/router"
import DevRouter from "!%/dev/router"
import APIRouter from "!%/api/router"
import { Environment } from "$/types/server"
import EnhancerRouter from "!%/enhancer/router"

export default class extends Router {
	constructor() {
		super()

		this.useRoutersAsync(new Promise(resolve => {
			resolve([
				new APIRouter(),
				new EnhancerRouter()
			])
		}))

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
