import Router from "!/bases/router"
import PostCreate from "!%/api/comment/create.post"
import DeleteArchive from "!%/api/comment/archive.delete"
import PatchUpdate from "!%/api/comment/update(id).patch"
import PatchRestore from "!%/api/comment/restore.patch"

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
