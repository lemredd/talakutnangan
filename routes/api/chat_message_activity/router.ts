import Router from "!/bases/router"
import GetList from "!%/api/chat_message_activity/list.get"
import PatchRestore from "!%/api/chat_message_activity/restore.patch"
import DeleteArchive from "!%/api/chat_message_activity/archive.delete"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetList(),
			new PatchRestore(),
			new DeleteArchive()
		])
	}
}
