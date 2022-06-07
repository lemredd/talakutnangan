import { UserKind } from "%/types"
import JSONBodyParser from "!/middlewares/body_parser/json"
import GuestOnlyPolicy from "!/middlewares/authentication/guest_only_policy"
import KnownOnlyPolicy from "!/middlewares/authentication/known_only_policy"
import EmailVerificationSender from "!/middlewares/authentication/email_verification_sender"

export default class CommonMiddlewareList {
	static guestOnlyPolicy: GuestOnlyPolicy
	static knownOnlyPolicy: KnownOnlyPolicy
	static unreachableEmployeeOnlyPolicy: KnownOnlyPolicy
	static reachableEmployeeOnlyPolicy: KnownOnlyPolicy
	static studentOnlyPolicy: KnownOnlyPolicy
	static JSONBody: JSONBodyParser
	static emailVerificationSender: EmailVerificationSender

	static initialize() {
		if (CommonMiddlewareList.guestOnlyPolicy === undefined) {
			CommonMiddlewareList.guestOnlyPolicy = new GuestOnlyPolicy()
			CommonMiddlewareList.knownOnlyPolicy = new KnownOnlyPolicy(null)
			CommonMiddlewareList.unreachableEmployeeOnlyPolicy= new KnownOnlyPolicy(
				UserKind.UnreachableEmployee
			)
			CommonMiddlewareList.reachableEmployeeOnlyPolicy= new KnownOnlyPolicy(
				UserKind.ReachableEmployee
			)
			CommonMiddlewareList.studentOnlyPolicy= new KnownOnlyPolicy(UserKind.Student)

			CommonMiddlewareList.JSONBody = new JSONBodyParser()
			CommonMiddlewareList.emailVerificationSender = new EmailVerificationSender()
		}
	}
}
