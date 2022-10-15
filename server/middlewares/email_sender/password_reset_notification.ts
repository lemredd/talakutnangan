import type { PreprocessedRequest } from "!/types/dependent"
import type { PasswordResetArguments } from "!/types/independent"

import Log from "$!/singletons/log"
import URLMaker from "$!/singletons/url_maker"
import Transport from "!/singletons/transport"
import RequestFilter from "!/bases/request_filter"

/**
 * Creates middleware to provide e-mail notification to password resets.
 */
export default class extends RequestFilter {
	async filterRequest(request: PreprocessedRequest<PasswordResetArguments>): Promise<void> {
		const recipient = request.nextMiddlewareArguments.emailToContact
		const subject = "Password Reset in Talakutnangan"

		Log.trace("middleware", "sending e-mail notification to user with default password")

		try {
			await Transport.sendMail(
				[ recipient.email ],
				subject,
				"password_reset.md",
				{
					"homePageURL": URLMaker.makeBaseURL(),
					...recipient
				}
			)

			Log.success("middleware", "user was emailed about password reset")
		} catch (error) {
			Log.error("middleware", error as Error)

			throw error
		}
	}
}
