import Router from "!/bases/router"
import PostCreate from "!%/api/chat_message/create.post"
import PatchUpdate from "!%/api/chat_message/update(id).patch"
import PostCreateWithFile from "!%/api/chat_message/create_with_file.post"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new PostCreate(),
			new PatchUpdate(),
			new PostCreateWithFile()
		])
	}
}
