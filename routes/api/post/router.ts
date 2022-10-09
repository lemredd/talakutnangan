import Router from "!/bases/router"
import PostCreate from "!%/api/post/create.post"
import DeleteArchive from "!%/api/post/archive.delete"
import PatchUpdate from "!%/api/post/update(id).patch"
import PatchRestore from "!%/api/post/restore.patch"

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
			new PostCreate(),
			new DeleteArchive(),
			new PatchUpdate(),
			new PatchRestore()
		])
	}
}
