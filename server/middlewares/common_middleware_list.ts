import GuestPageGuard from "!/middlewares/authentication/guest_page_guard"
import AuthenticatedPageGuard from "!/middlewares/authentication/authenticated_page_guard"

import JSONBodyParser from "!/middlewares/body_parser/json"
import EmailVerificationSender from "!/middlewares/authentication/email_verification_sender"

export default class CommonMiddlewareList {
	static guestPageGuard: GuestPageGuard
	static basicAuthenticatedPageGuard: AuthenticatedPageGuard
	static JSONBody: JSONBodyParser
	static emailVerificationSender: EmailVerificationSender

	static initialize() {
		if (CommonMiddlewareList.guestPageGuard === undefined) {
			CommonMiddlewareList.guestPageGuard = new GuestPageGuard()
			CommonMiddlewareList.basicAuthenticatedPageGuard = new AuthenticatedPageGuard(null)
			CommonMiddlewareList.JSONBody = new JSONBodyParser()
			CommonMiddlewareList.emailVerificationSender = new EmailVerificationSender()
		}
	}
}
