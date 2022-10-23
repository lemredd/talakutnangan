import Router from "!/bases/router"
import ReadRouter from "!%/api/consultation(id)/read/router"
import RequestRouter from "!%/api/consultation(id)/request/router"
import instantiateSimultaneously from "!/helpers/instantiate_simultaneously"

export default class extends Router {
	constructor() {
		super()

		this.useRoutersAsync(instantiateSimultaneously([
			RequestRouter,
			ReadRouter
		]))
	}
}
