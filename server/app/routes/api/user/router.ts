import Router from "!/bases/router"
import Controller from "!/bases/controller"
import GetList from "!/app/routes/api/user/list.get"
import GetCreate from "!/app/routes/api/user/create.get"
import PostLogIn from "!/app/routes/api/user/log_in.post"
import PostLogOut from "!/app/routes/api/user/log_out.post"
import PostRegister from "!/app/routes/api/user/register.post"
import PatchUpdate from "!/app/routes/api/user/update(id).patch"
import GetLogInFailure from "!/app/routes/api/user/log_in_failure.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetList(),
			new GetCreate(),
			new PostLogIn(),
			new PostLogOut(),
			new PatchUpdate(),
			new PostRegister(),
			new GetLogInFailure()
		])
	}
}
