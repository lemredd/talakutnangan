import { UserKind } from "%/types"
import JSONBodyParser from "!/middlewares/body_parser/json"
import KnownOnlyPolicy from "!/middlewares/authentication/known_only_policy"
import EmailVerificationSender from "!/middlewares/authentication/email_verification_sender"
import AuthenticationBasedPolicy from "!/middlewares/authentication/authentication-based_policy"

export default class CommonMiddlewareList {
	static guestOnlyPolicy: AuthenticationBasedPolicy
	static knownOnlyPolicy: AuthenticationBasedPolicy
	static unreachableEmployeeOnlyPolicy: KnownOnlyPolicy
	static reachableEmployeeOnlyPolicy: KnownOnlyPolicy
	static studentOnlyPolicy: KnownOnlyPolicy
	static JSONBody: JSONBodyParser
	static emailVerificationSender: EmailVerificationSender

	static initialize() {
		if (CommonMiddlewareList.guestOnlyPolicy === undefined) {
			CommonMiddlewareList.guestOnlyPolicy = new AuthenticationBasedPolicy(false)
			CommonMiddlewareList.knownOnlyPolicy = new AuthenticationBasedPolicy(true)
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
