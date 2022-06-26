import type { NewUserNotificationArguments } from "!/types/independent"
import type { PreprocessedRequest, Response, NextFunction } from "!/types/dependent"

import Log from "!/helpers/log"
import Middleware from "!/bases/middleware"
import Transport from "!/helpers/email/transport"

/**
 * Creates middleware to provide e-mail notification to new users.
 */
export default class extends Middleware {
	async intermediate(
		request: PreprocessedRequest<NewUserNotificationArguments>,
		_response: Response,
		next: NextFunction
	): Promise<void> {
		const recipients = request.nextMiddlewareArguments.userDetails
		const subject = "New User in Talakutnangan"

		Log.trace("middleware", "sending e-mail notifications to new users")

		await Promise.all(recipients.map(recipient => Transport.sendMail(
			[ recipient.email ],
			subject,
			"new_user_notification.md",
			{
				homePageURL: `${request.protocol}://${request.hostname}`,
				...recipient
			}
		)))
			.then(info => {
				Log.success("middleware", "new users were e-mailed")

				next()
			})
			.catch(error => {
				Log.error("middleware", error)

				next(error)
			})
	}
}
