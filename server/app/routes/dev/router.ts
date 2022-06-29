import Router from "!/bases/router"
import GetLogInAsAdminRoute from "!/app/routes/dev/log_in_as_admin.get"
import GetSampleUserListRoute from "!/app/routes/dev/sample_user_list.get"
import GetEmailVerificationRoute from "!/app/routes/dev/email_verification.get"
import GetNewUserNotificationRoute from "!/app/routes/dev/new_user_notification.get"

export default class extends Router {
	get prefix():string { return "/dev" }

	constructor() {
		super()

		this.useControllers([
			new GetLogInAsAdminRoute(),
			new GetSampleUserListRoute(),
			new GetEmailVerificationRoute(),
			new GetNewUserNotificationRoute()
		])
	}
}
