import type { Request, Response, NextFunction } from "express"

import type { WithRegistration } from "!/types"
import Transport from "!/helpers/email/transport"
import Middleware from "!/routes/bases/middleware"

/**
 * Creates middleware to provide email verification for new users or updated email addresses.
 */
export default class extends Middleware {
	intermediate(
		request: Request & WithRegistration,
		_response: Response,
		next: NextFunction
	): void {
		const to = request.body.email
		const subject = "Email Verification"
		Transport.sendMail(to, subject, "email_verification.md", {
			email: to,
			homePageURL: `${request.protocol}://${request.hostname}`,
			emailVerificationURL: `${request.protocol}://${request.hostname}/user/verify?=${to}`
		})
			.then(info => {
				console.log(info)
				next()
			})
			.catch(error => {
				console.error(`Error [${error}]: ${error.message}`)
				next(error)
			})
	}
}
