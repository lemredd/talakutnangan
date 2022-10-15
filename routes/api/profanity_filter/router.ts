import Router from "!/bases/router"
import GetList from "!%/api/profanity_filter/list.get"
import PostCreate from "!%/api/profanity_filter/create.post"
import PatchRestore from "!%/api/profanity_filter/restore.patch"
import PatchUpdate from "!%/api/profanity_filter/update(id).patch"
import DeleteArchive from "!%/api/profanity_filter/archive.delete"

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new GetList(),
				new PostCreate(),
				new PatchUpdate(),
				new PatchRestore(),
				new DeleteArchive()
			])
		}))
	}
}
