import { UserKind } from "%/types/independent"
import JSONBodyParser from "!/middlewares/body_parser/json"
import MultipartParser from "!/middlewares/body_parser/multipart"
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
	static multipart: MultipartParser
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
			CommonMiddlewareList.multipart = new MultipartParser()
			CommonMiddlewareList.emailVerificationSender = new EmailVerificationSender()
		}
	}
}
