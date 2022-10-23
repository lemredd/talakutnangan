import Router from "!/bases/router"
import PostCreate from "!%/api/semester/create.post"
import DeleteArchive from "!%/api/semester/archive.delete"
import PatchUpdate from "!%/api/semester/update(id).patch"
import PatchRestore from "!%/api/semester/restore.patch"

export const controllers = [
	PostCreate,
	DeleteArchive,
	PatchUpdate,
	PatchRestore
]

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
		}))
	}
}
