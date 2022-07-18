import Router from "!/bases/router"
import GetList from "!/app/routes/api/user/list.get"
import PostLogIn from "!/app/routes/api/user/log_in.post"
import PostImport from "!/app/routes/api/user/import.post"
import PostLogOut from "!/app/routes/api/user/log_out.post"
import PatchUpdate from "!/app/routes/api/user/update(id).patch"
import GetLogInFailure from "!/app/routes/api/user/log_in_failure.get"
import PatchResetPassword from "!/app/routes/api/user/reset_password(id).patch"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetList(),
			new PostLogIn(),
			new PatchUpdate(),
			new PostImport(),
			new PostLogOut(),
			new GetLogInFailure(),
			new PatchResetPassword()
		])
	}
}
