import type { GeneralObject } from "$/types/general"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserDocument } from "$/types/documents/user"
import type { Permissions as UserPermissions } from "$/permissions/user"

import KindBasedPolicy from "!/policies/kind-based"
import JSONBodyParser from "!/middlewares/body_parser/json"
import PermissionBasedPolicy from "!/policies/permission-based"
import MultipartParser from "!/middlewares/body_parser/multipart"
import AuthenticationBasedPolicy from "!/policies/authentication-based"
import EmailVerification from "!/middlewares/email_sender/email_verification"
import NewUserNotification from "!/middlewares/email_sender/new_user_notification"

import deserialize from "$/helpers/deserialize"
import { user } from "$/permissions/permission_list"
import AuthorizationError from "$!/errors/authorization"
import {
	UPDATE_OWN_DATA,
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

export default class CommonMiddlewareList {
	static guestOnlyPolicy: AuthenticationBasedPolicy
	static knownOnlyPolicy: AuthenticationBasedPolicy
	static unreachableEmployeeOnlyPolicy: KindBasedPolicy
	static reachableEmployeeOnlyPolicy: KindBasedPolicy
	static studentOnlyPolicy: KindBasedPolicy
	static employeeSchedulePolicy: PermissionBasedPolicy<GeneralObject<number>, UserPermissions, any>

	static JSONBody: JSONBodyParser
	static multipart: MultipartParser
	static emailVerification: EmailVerification
	static newUserNotification: NewUserNotification

	static initialize() {
		if (typeof CommonMiddlewareList.guestOnlyPolicy === "undefined") {
			CommonMiddlewareList.guestOnlyPolicy = new AuthenticationBasedPolicy(false)
			CommonMiddlewareList.knownOnlyPolicy = new AuthenticationBasedPolicy(true)
			CommonMiddlewareList.unreachableEmployeeOnlyPolicy = new KindBasedPolicy(
				"unreachable_employee"
			)
			CommonMiddlewareList.reachableEmployeeOnlyPolicy = new KindBasedPolicy(
				"reachable_employee"
			)
			CommonMiddlewareList.studentOnlyPolicy = new KindBasedPolicy("student")
			CommonMiddlewareList.employeeSchedulePolicy = new PermissionBasedPolicy(user, [
				UPDATE_OWN_DATA,
				UPDATE_ANYONE_ON_OWN_DEPARTMENT,
				UPDATE_ANYONE_ON_ALL_DEPARTMENTS
			], (request: AuthenticatedRequest) => {
				const currentUser = deserialize(request.user) as DeserializedUserDocument
				const roles = currentUser.data.roles.data
				const hasWidePermission = user.hasOneRoleAllowed(
					roles,
					[ UPDATE_ANYONE_ON_OWN_DEPARTMENT, UPDATE_ANYONE_ON_ALL_DEPARTMENTS ]
				)

				if (!hasWidePermission) {
					if (currentUser.data.kind !== "reachable_employee") {
						return Promise.reject(
							new AuthorizationError("Action is not available to the current user.")
						)
					}
				}

				return Promise.resolve()
			})

			CommonMiddlewareList.JSONBody = new JSONBodyParser()
			CommonMiddlewareList.multipart = new MultipartParser()
			CommonMiddlewareList.emailVerification = new EmailVerification()
			CommonMiddlewareList.newUserNotification = new NewUserNotification()
		}
	}
}
