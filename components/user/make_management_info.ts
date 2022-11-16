import type { UserManagementInfo } from "$@/types/independent"
import type { DeserializedUserDocument, DeserializedUserProfile } from "$/types/documents/user"

import { user as permissionGroup } from "$/permissions/permission_list"
import {
	RESET_PASSWORD,
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS,
	ARCHIVE_AND_RESTORE_ANYONE_ON_ALL_DEPARTMENT,
	ARCHIVE_AND_RESTORE_ANYONE_ON_OWN_DEPARTMENT
} from "$/permissions/user_combinations"

export default function(
	userProfile: DeserializedUserProfile<"roles"|"department">,
	user: DeserializedUserDocument<"roles"|"department">
): UserManagementInfo {
	const ownDepartment = userProfile.data.department.data.id
	const isOnSameDepartment = ownDepartment === user.data.department.data.id

	const isDeleted = Boolean(user.data.deletedAt)
	const doesViewOwn = user.data.id === userProfile.data.id
	const userRoles = userProfile.data.roles.data

	const mayUpdateAnyone = permissionGroup.hasOneRoleAllowed(userRoles, [
		UPDATE_ANYONE_ON_ALL_DEPARTMENTS
	])

	const isUpdateLimitedUpToDepartmentScope = permissionGroup.hasOneRoleAllowed(userRoles, [
		UPDATE_ANYONE_ON_OWN_DEPARTMENT
	]) && isOnSameDepartment

	const mayUpdateUser = isUpdateLimitedUpToDepartmentScope || mayUpdateAnyone

	const isArchiveOrRestoreLimitedUpToDepartmentScope = permissionGroup.hasOneRoleAllowed(
		userRoles,
		[ ARCHIVE_AND_RESTORE_ANYONE_ON_OWN_DEPARTMENT ]
	) && isOnSameDepartment

	const isArchiveOrRestoreLimitedUpToGlobalScope = permissionGroup.hasOneRoleAllowed(userRoles, [
		ARCHIVE_AND_RESTORE_ANYONE_ON_ALL_DEPARTMENT
	])

	const mayArchiveOrRestoreUser = isArchiveOrRestoreLimitedUpToDepartmentScope
		|| isArchiveOrRestoreLimitedUpToGlobalScope

	const mayArchiveUser = !doesViewOwn && !isDeleted && mayArchiveOrRestoreUser
	const mayRestoreUser = isDeleted && mayArchiveOrRestoreUser

	const mayUpdateAttachedRoles = !doesViewOwn && mayUpdateAnyone

	const mayResetPassword = permissionGroup.hasOneRoleAllowed(userRoles, [
		RESET_PASSWORD
	]) && !isDeleted

	return {
		isDeleted,
		mayArchiveUser,
		mayResetPassword,
		mayRestoreUser,
		mayUpdateAnyone,
		mayUpdateAttachedRoles,
		mayUpdateUser
	}
}
