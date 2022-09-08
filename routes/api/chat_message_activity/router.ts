import Router from "!/bases/router"
import PatchRestore from "!%/api/chat_message_activity/restore.patch"
import DeleteArchive from "!%/api/chat_message_activity/archive.delete"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new PatchRestore(),
			new DeleteArchive()
		])
	}
}
