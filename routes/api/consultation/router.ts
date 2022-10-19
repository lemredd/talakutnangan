import Router from "!/bases/router"
import GetList from "!%/api/consultation/list.get"
import PostCreate from "!%/api/consultation/create.post"
import PatchUpdate from "!%/api/consultation/update(id).patch"
import GetReadTimeSumByWeek from "!%/api/consultation/read_time_sum_by_week.get"
// import PatchRestore from "!%/api/consultation/restore.patch"
// import DeleteArchive from "!%/api/consultation/archive.delete"

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new GetList(),
				new PostCreate(),
				new PatchUpdate(),
				new GetReadTimeSumByWeek()
				// new PatchRestore(),
				// new DeleteArchive()
			])
		}))
	}
}
