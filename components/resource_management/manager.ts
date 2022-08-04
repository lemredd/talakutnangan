import type { DeserializedUserProfile } from "$/types/documents/user"
import type { DeserializedRoleResource } from "$/types/documents/role"

import UserPermission from "$/permissions/user"
import {
	READ_ANYONE_ON_OWN_DEPARTMENT,
	READ_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

export default class {
	readonly user: DeserializedUserProfile
	readonly permission: UserPermission = new UserPermission()

	constructor(user: DeserializedUserProfile) {
		this.user = user
	}

	isInstituteLimited(): boolean {
		return (
			!this.isAdmin()
			&& this.doesBelongToAdmissableDepartment
			&& this.permission.hasOneRoleAllowed(this.userRoles, [
				READ_ANYONE_ON_OWN_DEPARTMENT
			])
		)
	}

	isStudentServiceLimited(): boolean {
		return (
			!this.isAdmin()
			&& !this.doesBelongToAdmissableDepartment
			&& this.permission.hasOneRoleAllowed(this.userRoles, [
				READ_ANYONE_ON_OWN_DEPARTMENT
			])
		)
	}

	isAdmin(): boolean {
		return this.permission.hasOneRoleAllowed(this.userRoles, [
			READ_ANYONE_ON_ALL_DEPARTMENTS
		])
	}

	protected get userRoles(): DeserializedRoleResource[] {
		return this.user.data.roles.data
	}

	protected get doesBelongToAdmissableDepartment(): boolean {
		return this.user.data.department.data.mayAdmit
	}
}
