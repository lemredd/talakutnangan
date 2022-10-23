import Router from "!/bases/router"
import PatchUpdate from "!%/api/user(id)/relationships/department/update.patch"

export const controllers = [ PatchUpdate ]

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new PatchUpdate()
			])
		}))
	}
}
