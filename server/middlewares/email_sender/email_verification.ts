import type { EmailVerificationArguments } from "!/types/independent"
import type { PreprocessedRequest, Response, NextFunction } from "!/types/dependent"

import Log from "$!/singletons/log"
import Middleware from "!/bases/middleware"
import URLMaker from "$!/singletons/url_maker"
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

		const emailTransmissions = recipients.map(recipient => {
			return new Promise(resolve => {
				URLMaker.makeTemporaryURL("/user/verify", {
					email: recipient
				}, 1000 * 60 * 30 /* Verification is available for 30 minutes */)
				.then(resolve)
			}).then(emailVerificationURL => {
				return Transport.sendMail(
					[ recipient ],
					subject,
					"email_verification.md",
					{
						email: recipient,
						homePageURL: URLMaker.makeBaseURL(),
						emailVerificationURL
					}
				)
			})
		})

		for (const transmission of emailTransmissions) {
			try {
				await transmission
			} catch(error) {
				Log.error("middleware", error as Error)

				next(error)
			}
		}

		Log.success("middleware", "e-mail messages were sent")

		next()
	}
}
