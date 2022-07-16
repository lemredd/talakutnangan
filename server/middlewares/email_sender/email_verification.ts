import type { EmailVerificationArguments } from "!/types/independent"
import type { PreprocessedRequest, Response, NextFunction } from "!/types/dependent"

import Log from "$!/singletons/log"
import Middleware from "!/bases/middleware"
import Transport from "!/helpers/email/transport"

/**
 * Creates middleware to provide email verification for new users or updated email addresses.
 */
export default class extends Middleware {
	async intermediate(
		request: PreprocessedRequest<EmailVerificationArguments>,
		_response: Response,
		next: NextFunction
	): Promise<void> {
		const recipients = request.nextMiddlewareArguments.emailsToContact
		const subject = "Email Verification"

		Log.trace("middleware", "sending verification e-mail messages to recipients")

		await Promise.all(recipients.map(recipient => Transport.sendMail(
			[ recipient ],
			subject,
			"email_verification.md",
			{
				email: recipient,
				homePageURL: `${request.protocol}://${request.hostname}`,
				emailVerificationURL:
					`${request.protocol}://${request.hostname}/user/verify?to=${recipient}`
			}
		)))
			.then(info => {
				Log.success("middleware", "e-mail messages were sent")

				next()
			})
			.catch(error => {
				Log.error("middleware", error)

				next(error)
			})
	}
}
