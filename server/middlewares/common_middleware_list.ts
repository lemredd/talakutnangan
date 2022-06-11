import { UserKind } from "%/types"
import JSONBodyParser from "!/middlewares/body_parser/json"
import KindBasedPolicy from "!/middlewares/authentication/kind-based_policy"
import EmailVerificationSender from "!/middlewares/authentication/email_verification_sender"
import AuthenticationBasedPolicy from "!/middlewares/authentication/authentication-based_policy"

export default class CommonMiddlewareList {
	static guestOnlyPolicy: AuthenticationBasedPolicy
	static knownOnlyPolicy: AuthenticationBasedPolicy
	static unreachableEmployeeOnlyPolicy: KindBasedPolicy
	static reachableEmployeeOnlyPolicy: KindBasedPolicy
	static studentOnlyPolicy: KindBasedPolicy
	static JSONBody: JSONBodyParser
	static emailVerificationSender: EmailVerificationSender

	static initialize() {
		if (CommonMiddlewareList.guestOnlyPolicy === undefined) {
			CommonMiddlewareList.guestOnlyPolicy = new AuthenticationBasedPolicy(false)
			CommonMiddlewareList.knownOnlyPolicy = new AuthenticationBasedPolicy(true)
			CommonMiddlewareList.unreachableEmployeeOnlyPolicy= new KindBasedPolicy(
				UserKind.UnreachableEmployee
			)
			CommonMiddlewareList.reachableEmployeeOnlyPolicy= new KindBasedPolicy(
				UserKind.ReachableEmployee
			)
			CommonMiddlewareList.studentOnlyPolicy= new KindBasedPolicy(UserKind.Student)

			CommonMiddlewareList.JSONBody = new JSONBodyParser()
			CommonMiddlewareList.emailVerificationSender = new EmailVerificationSender()
		}
	}
}
