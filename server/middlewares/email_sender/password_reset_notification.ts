import type { PasswordResetArguments } from "!/types/independent"
import type { PreprocessedRequest, Response, NextFunction } from "!/types/dependent"

import Log from "$!/singletons/log"
import Middleware from "!/bases/middleware"
import URLMaker from "$!/singletons/url_maker"
import Transport from "!/helpers/email/transport"

/**
 * Creates middleware to provide e-mail notification to password resets.
 */
export default class extends Middleware {
	async intermediate(
		request: PreprocessedRequest<PasswordResetArguments>,
		_response: Response,
		next: NextFunction
	): Promise<void> {
		const recipient = request.nextMiddlewareArguments.emailToContact
		const subject = "Password Reset in Talakutnangan"

		Log.trace("middleware", "sending e-mail notification to user with default password")

		await Transport.sendMail(
			[ recipient.email ],
			subject,
			"password_reset.md",
			{
				homePageURL: URLMaker.makeBaseURL(),
				...recipient
			}
		)
		.then(info => {
			Log.success("middleware", "user was emailed about password reset")

			next()
		})
		.catch(error => {
			Log.error("middleware", error as Error)

			next(error)
		})
	}
}
