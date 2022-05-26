import Router from "!/helpers/router"
import GetList from "!/routes/api/user/list.get"
import GetCreate from "!/routes/api/user/create.get"
import PostLogIn from "!/routes/api/user/log_in.post"
import PostLogOut from "!/routes/api/user/log_out.post"
import PatchUpdate from "!/routes/api/user/update.patch"
import PostRegister from "!/routes/api/user/register.post"
import GetLogInFailure from "!/routes/api/user/log_in_failure.get"

export default class extends Router {
	constructor(parentPrefix: string) {
		super(`${parentPrefix}/user`)

		this.useController(new GetList())
		this.useController(new GetCreate())
		this.useController(new PostLogIn())
		this.useController(new PostLogOut())
		this.useController(new PatchUpdate())
		this.useController(new PostRegister())
		this.useController(new GetLogInFailure())
	}
}
