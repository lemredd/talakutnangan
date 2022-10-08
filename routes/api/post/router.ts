import Router from "!/bases/router"
import PostCreate from "!%/api/department/create.post"
import DeleteArchive from "!%/api/department/archive.delete"
import PatchUpdate from "!%/api/department/update(id).patch"
import PatchRestore from "!%/api/department/restore.patch"

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
