import KindBasedPolicy from "!/policies/kind-based"
import JSONBodyParser from "!/middlewares/body_parser/json"
import MultipartParser from "!/middlewares/body_parser/multipart"
import AuthenticationBasedPolicy from "!/policies/authentication-based"
import EmailVerification from "!/middlewares/email_sender/email_verification"
import NewUserNotification from "!/middlewares/email_sender/new_user_notification"

export default class CommonMiddlewareList {
	static guestOnlyPolicy: AuthenticationBasedPolicy
	static knownOnlyPolicy: AuthenticationBasedPolicy
	static unreachableEmployeeOnlyPolicy: KindBasedPolicy
	static reachableEmployeeOnlyPolicy: KindBasedPolicy
	static studentOnlyPolicy: KindBasedPolicy
	static JSONBody: JSONBodyParser
	static multipart: MultipartParser
	static emailVerification: EmailVerification
	static newUserNotification: NewUserNotification

	static initialize() {
		if (CommonMiddlewareList.guestOnlyPolicy === undefined) {
			CommonMiddlewareList.guestOnlyPolicy = new AuthenticationBasedPolicy(false)
			CommonMiddlewareList.knownOnlyPolicy = new AuthenticationBasedPolicy(true)
			CommonMiddlewareList.unreachableEmployeeOnlyPolicy= new KindBasedPolicy(
				"unreachable_employee"
			)
			CommonMiddlewareList.reachableEmployeeOnlyPolicy= new KindBasedPolicy(
				"reachable_employee"
			)
			CommonMiddlewareList.studentOnlyPolicy= new KindBasedPolicy("student")

			CommonMiddlewareList.JSONBody = new JSONBodyParser()
			CommonMiddlewareList.multipart = new MultipartParser()
			CommonMiddlewareList.emailVerification = new EmailVerification()
			CommonMiddlewareList.newUserNotification = new NewUserNotification()
		}
	}
}
