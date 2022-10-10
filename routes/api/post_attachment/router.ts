import Router from "!/bases/router"
import GetRead from "!%/api/post_attachment/read(id).get"
import PostCreate from "!%/api/post_attachment/create.post"

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new GetRead(),
				new PostCreate()
			])
		}))
	}
}
