import type { GeneralObject } from "$/types/general"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserDocument } from "$/types/documents/user"

import Middleware from "!/bases/middleware"
import KindBasedPolicy from "!/policies/kind-based"
import JSONBodyParser from "!/middlewares/body_parser/json"
import PermissionBasedPolicy from "!/policies/permission-based"
import MultipartParser from "!/middlewares/body_parser/multipart"
import AuthenticationBasedPolicy from "!/policies/authentication-based"
import EmailVerification from "!/middlewares/email_sender/email_verification"
import NewUserNotification from "!/middlewares/email_sender/new_user_notification"

import deserialize from "$/helpers/deserialize"
import mergeDeeply from "$!/helpers/merge_deeply"
import { user } from "$/permissions/permission_list"
import AuthorizationError from "$!/errors/authorization"
import {
	UPDATE_OWN_DATA,
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

function makeList() {
	const policies = {
		"employeeSchedulePolicy": new PermissionBasedPolicy(user, [
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
		}),
		"guestOnlyPolicy": new AuthenticationBasedPolicy(false),
		"knownOnlyPolicy": new AuthenticationBasedPolicy(true),
		"reachableEmployeeOnlyPolicy": new KindBasedPolicy("reachable_employee"),
		"studentOnlyPolicy": new KindBasedPolicy("student"),
		"unreachableEmployeeOnlyPolicy": new KindBasedPolicy("unreachable_employee")
	}

	const parsers = {
		"JSONBody": new JSONBodyParser(),
		"multipart": new MultipartParser()
	}

	const emailSenders = {
		"emailVerification": new EmailVerification(),
		"newUserNotification": new NewUserNotification()
	}

	return {
		...policies,
		...parsers,
		...emailSenders
	}
}

type List = ReturnType<typeof makeList>
type ListKeys = keyof List

const list = new Proxy({} as List, {
	get(target: List|GeneralObject<any>, property: ListKeys|"initialize"): Middleware|void {
		if (property === "initialize") {
			const madeList = makeList()
			mergeDeeply(target, madeList)
			return
		}

		// eslint-disable-next-line consistent-return
		return target[property]
	}
})

export default list
