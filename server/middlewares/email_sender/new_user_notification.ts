import type { NewUserNotificationArguments } from "!/types/independent"
import type { PreprocessedRequest, Response, NextFunction } from "!/types/dependent"

import Log from "$!/singletons/log"
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

		try {
			for (const recipient of recipients) {
				await Transport.sendMail(
					[ recipient.email ],
					subject,
					"new_user.md",
					{
						homePageURL: `${request.protocol}://${request.hostname}`,
						...recipient
					}
				)
			}

			Log.success("middleware", "new users were e-mailed")

			next()
		} catch(error) {
			Log.error("middleware", error as Error)

			next(error)
		}
	}
}
