import GuestPageGuard from "!/middlewares/authentication/guest_page_guard"
import KnownOnlyPolicy from "!/middlewares/authentication/known_only_policy"

import JSONBodyParser from "!/middlewares/body_parser/json"
import EmailVerificationSender from "!/middlewares/authentication/email_verification_sender"

export default class CommonMiddlewareList {
	static guestPageGuard: GuestPageGuard
	static knownOnlyPolicy: KnownOnlyPolicy
	static JSONBody: JSONBodyParser
	static emailVerificationSender: EmailVerificationSender

	static initialize() {
		if (CommonMiddlewareList.guestPageGuard === undefined) {
			CommonMiddlewareList.guestPageGuard = new GuestPageGuard()
			CommonMiddlewareList.knownOnlyPolicy = new KnownOnlyPolicy(null)
			CommonMiddlewareList.JSONBody = new JSONBodyParser()
			CommonMiddlewareList.emailVerificationSender = new EmailVerificationSender()
		}
	}
}
