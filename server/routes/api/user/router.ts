import Router from "!/bases/router"
import Controller from "!/bases/controller"
import GetList from "!/routes/api/user/list.get"
import GetCreate from "!/routes/api/user/create.get"
import PostLogIn from "!/routes/api/user/log_in.post"
import PostLogOut from "!/routes/api/user/log_out.post"
import PatchUpdate from "!/routes/api/user/update.patch"
import PostRegister from "!/routes/api/user/register.post"
import GetLogInFailure from "!/routes/api/user/log_in_failure.get"

export default class extends Router {
	private parentPrefix: string
	get prefix(): string { return `${this.parentPrefix}/user` }

	constructor(parentPrefix: string) {
		super()

		this.parentPrefix = parentPrefix

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
