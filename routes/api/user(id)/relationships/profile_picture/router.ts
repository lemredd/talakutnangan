import Router from "!/bases/router"
import PostCreate from "!%/api/user(id)/relationships/profile_picture/create.post"

export const controllers = [ PostCreate ]

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new PostCreate()
			])
		}))
	}
}
