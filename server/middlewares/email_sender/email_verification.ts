import type { PreprocessedRequest } from "!/types/dependent"
import type { EmailVerificationArguments } from "!/types/independent"

import Log from "$!/singletons/log"
import URLMaker from "$!/singletons/url_maker"
import Transport from "!/singletons/transport"
import RequestFilter from "!/bases/request_filter"

/**
 * Creates middleware to provide email verification for new users or updated email addresses.
 */
export default class extends RequestFilter {
	async filterRequest(request: PreprocessedRequest<EmailVerificationArguments>): Promise<void> {
		const recipients = request.nextMiddlewareArguments.emailsToContact
		const subject = "Email Verification"

		Log.trace("middleware", "sending verification e-mail messages to recipients")

		const MILLISECONDS_PER_SECOND = 1000
		const SECONDS_PER_MINUTE = 60
		const EXPIRATION_MINUTE_DURATION = 30
		const EXPIRATION_MILLISECOND_DURATION
			= MILLISECONDS_PER_SECOND
				* SECONDS_PER_MINUTE
				* EXPIRATION_MINUTE_DURATION

		const emailTransmissions = recipients.map(async recipient => await Transport.sendMail(
			[ recipient.email ],
			subject,
			"email_verification.md",
			{
				"email": recipient.email,
				"emailVerificationURL": await URLMaker.makeTemporaryURL("/user/verify", {
					"id": recipient.id
					// Verification is available for 30 minutes
				}, EXPIRATION_MILLISECOND_DURATION),
				"homePageURL": URLMaker.makeBaseURL()
			}
		))

		if (this.isOnTest) {
			for (const transmission of emailTransmissions) {
				try {
					// Force to wait for transmission to test with expected order
					// eslint-disable-next-line no-await-in-loop
					const sentInfo = await transmission
					Log.trace("middleware", `Sent email verification to ${sentInfo.envelope.to[0]}`)
				} catch (error) {
					Log.error("middleware", error as Error)

					throw error
				}
			}
		} else {
			try {
				await Promise.all(emailTransmissions)
				Log.trace("middleware", "Sent email verification to users")
			} catch (error) {
				Log.error("middleware", error as Error)

				throw error
			}
		}

		Log.success("middleware", "e-mail messages were sent")
	}
}
