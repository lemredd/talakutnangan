import Router from "!/bases/router"
import GetList from "!%/api/chat_message_activity/list.get"
import PatchRestore from "!%/api/chat_message_activity/restore.patch"
import PatchUpdate from "!%/api/chat_message_activity/update(id).patch"
import DeleteArchive from "!%/api/chat_message_activity/archive.delete"

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new GetList(),
				new PatchUpdate(),
				new PatchRestore(),
				new DeleteArchive()
			])
		}))
	}
}
