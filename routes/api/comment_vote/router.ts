import Router from "!/bases/router"
import GetList from "!%/api/comment_vote/list.get"
import PostCreate from "!%/api/comment_vote/create.post"
import DeleteArchive from "!%/api/comment_vote/archive.delete"
import PatchUpdate from "!%/api/comment_vote/update(id).patch"
import PatchRestore from "!%/api/comment_vote/restore.patch"

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new GetList(),
				new PostCreate(),
				new DeleteArchive(),
				new PatchUpdate(),
				new PatchRestore()
			])
		}))
	}
}
