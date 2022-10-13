import Router from "!/bases/router"
import GetList from "!%/api/consultation/list.get"
import PostCreate from "!%/api/consultation/create.post"
import PatchUpdate from "!%/api/consultation/update(id).patch"
import ReadRouter from "!%/api/consultation/read(id)/router"
// import PatchRestore from "!%/api/consultation/restore.patch"
// import DeleteArchive from "!%/api/consultation/archive.delete"

export default class extends Router {
	constructor() {
		super()

		this.useRoutersAsync(new Promise(resolve => {
			resolve([
				new ReadRouter()
			])
		}))
		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new GetList(),
				new PostCreate(),
				new PatchUpdate(),
				// new PatchRestore(),
				// new DeleteArchive()
			])
		}))
	}
}
