import Router from "!/helpers/router"
import GetList from "!/routes/api/user/list.get"
import PostLogIn from "!/routes/api/user/log_in.post"
import PostLogOut from "!/routes/api/user/log_out.post"
import PostRegister from "!/routes/api/user/register.post"
import GetLogInFailure from "!/routes/api/user/log_in_failure.get"

export default class extends Router {
	constructor() {
		super("/user")

		this.useController(new GetList())
		this.useController(new PostLogIn())
		this.useController(new PostLogOut())
		this.useController(new PostRegister())
		this.useController(new GetLogInFailure())
	}
}
