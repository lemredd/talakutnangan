import type { DepartmentManagementInfo } from "$@/types/independent"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { DeserializedDepartmentResource } from "$/types/documents/department"

import { department as permissionGroup } from "$/permissions/permission_list"
import {
	UPDATE, ARCHIVE_AND_RESTORE
} from "$/permissions/department_combinations"

export default function(
	userProfile: DeserializedUserProfile<"roles"|"department">,
	department: DeserializedDepartmentResource
): DepartmentManagementInfo {
	const isDeleted = Boolean(department.deletedAt)
	const roles = userProfile.data.roles.data

	const mayUpdateDepartment = permissionGroup.hasOneRoleAllowed(roles, [ UPDATE ])

	const mayArchiveDepartment = permissionGroup.hasOneRoleAllowed(roles, [
		ARCHIVE_AND_RESTORE
	]) && !isDeleted

	const mayRestoreDepartment = permissionGroup.hasOneRoleAllowed(roles, [
		ARCHIVE_AND_RESTORE
	]) && isDeleted

	return {
		isDeleted,
		mayArchiveDepartment,
		mayRestoreDepartment,
		mayUpdateDepartment
	}
}
