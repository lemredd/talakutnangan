import Router from "!/bases/router"
import GetEmailsRoute from "!%/dev/emails.get"
import GetServerInfoRoute from "!%/dev/server_info.get"
import GetLogInAsDeanRoute from "!%/dev/log_in_as_dean.get"
import GetLogInAsAdminRoute from "!%/dev/log_in_as_admin.get"
import GetLogInAsStudentRoute from "!%/dev/log_in_as_student.get"
import GetLogInAsSecretaryRoute from "!%/dev/log_in_as_secretary.get"
import GetLogInAsServiceHeadRoute from "!%/dev/log_in_as_service_head.get"

import GetSampleUserListRoute from "!%/dev/sample_user_list.get"
import GetSampleServerErrorRoute from "!%/dev/sample_server_error.get"
import GetMakeUnverifiedUserRoute from "!%/dev/make_unverified_user.get"
import GetNewUserNotificationRoute from "!%/dev/new_user_notification.get"
import GetMakeTestConsultationRoute from "!%/dev/make_test_consultation.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetEmailsRoute(),
			new GetServerInfoRoute(),
			new GetLogInAsDeanRoute(),
			new GetLogInAsAdminRoute(),
			new GetLogInAsStudentRoute(),
			new GetLogInAsSecretaryRoute(),
			new GetLogInAsServiceHeadRoute(),

			new GetSampleUserListRoute(),
			new GetSampleServerErrorRoute(),
			new GetMakeUnverifiedUserRoute(),
			new GetNewUserNotificationRoute(),
			new GetMakeTestConsultationRoute()
		])
	}
}
