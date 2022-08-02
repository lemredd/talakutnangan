import Router from "!/bases/router"
import GetEmailsRoute from "!%/dev/emails.get"
import GetServerInfoRoute from "!%/dev/server_info.get"
import GetLogInAsAdminRoute from "!%/dev/log_in_as_admin.get"
import GetSampleUserListRoute from "!%/dev/sample_user_list.get"
import GetSampleServerErrorRoute from "!%/dev/sample_server_error.get"
import GetMakeUnverifiedUserRoute from "!%/dev/make_unverified_user.get"
import GetNewUserNotificationRoute from "!%/dev/new_user_notification.get"

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
