import Router from "!/bases/router"
import GetList from "!%/api/consultation/list.get"
import PostCreate from "!%/api/consultation/create.post"
import ReadRouter from "!%/api/consultation/read(id)/router"
import RequestRouter from "!%/api/consultation/(id)request/router"
import PatchUpdate from "!%/api/consultation/update(id).patch"
// import PatchRestore from "!%/api/consultation/restore.patch"
// import DeleteArchive from "!%/api/consultation/archive.delete"

export default class extends Router {
	constructor() {
		super()

		this.useRoutersAsync(new Promise(resolve => {
			resolve([
				new ReadRouter(),
				new RequestRouter()
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
