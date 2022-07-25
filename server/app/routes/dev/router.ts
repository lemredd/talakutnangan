import Router from "!/bases/router"
import GetEmailsRoute from "!/app/routes/dev/emails.get"
import GetServerInfoRoute from "!/app/routes/dev/server_info.get"
import GetLogInAsAdminRoute from "!/app/routes/dev/log_in_as_admin.get"
import GetSampleUserListRoute from "!/app/routes/dev/sample_user_list.get"
import GetSampleServerErrorRoute from "!/app/routes/dev/sample_server_error.get"
import GetMakeUnverifiedUserRoute from "!/app/routes/dev/make_unverified_user.get"
import GetNewUserNotificationRoute from "!/app/routes/dev/new_user_notification.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetEmailsRoute(),
			new GetServerInfoRoute(),
			new GetLogInAsAdminRoute(),
			new GetSampleUserListRoute(),
			new GetSampleServerErrorRoute(),
			new GetMakeUnverifiedUserRoute(),
			new GetNewUserNotificationRoute()
		])
	}
}
