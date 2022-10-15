import type { PreprocessedRequest } from "!/types/dependent"
import type { NewUserNotificationArguments } from "!/types/independent"

import Log from "$!/singletons/log"
import Transport from "!/singletons/transport"
import RequestFilter from "!/bases/request_filter"

/**
 * Creates middleware to provide e-mail notification to new users.
 */
export default class extends RequestFilter {
	async filterRequest(request: PreprocessedRequest<NewUserNotificationArguments>): Promise<void> {
		const recipients = request.nextMiddlewareArguments.userDetails
		const subject = "New User in Talakutnangan"

		Log.trace("middleware", "sending e-mail notifications to new users")

		try {
			const promises: Promise<void>[] = []

			for (const recipient of recipients) {
				const promise = Transport.sendMail(
					[ recipient.email ],
					subject,
					"new_user.md",
					{
						"homePageURL": `${request.protocol}://${request.hostname}`,
						...recipient
					}
				)

				// eslint-disable-next-line no-await-in-loop
				if (this.isOnTest) await promise
				else promises.push(promise)
			}

			if (!this.isOnTest) await Promise.all(promises)

			Log.success("middleware", "new users were e-mailed")
		} catch (error) {
			Log.error("middleware", error as Error)

			throw error
		}
	}
}
