import Router from "!/bases/router"
import GetList from "!%/api/user/list.get"
import GetRead from "!%/api/user/read(id).get"
import PostLogIn from "!%/api/user/log_in.post"
import PostImport from "!%/api/user/import.post"
import PostLogOut from "!%/api/user/log_out.post"
import PatchUpdate from "!%/api/user/update(id).patch"
import PatchResetPassword from "!%/api/user/reset_password(id).patch"

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new GetList(),
				new GetRead(),
				new PostLogIn(),
				new PostImport(),
				new PostLogOut(),
				new PatchUpdate(),
				new PatchResetPassword()
			])
		}))
	}
}
