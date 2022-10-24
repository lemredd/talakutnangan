import Router from "!/bases/router"
import GetIndex from "!%/enhancer/forum/index.get"

export const controllers = [ GetIndex ]

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new GetIndex()
			])
		}))
	}
}
