import type { DepartmentManagementInfo } from "$@/types/independent"
import type { DeserializedDepartmentResource } from "$/types/documents/department"
import type { DeserializedUserProfile } from "$/types/documents/user"

import { department as permissionGroup } from "$/permissions/permission_list"
import {
	UPDATE, ARCHIVE_AND_RESTORE
} from "$/permissions/department_combinations"

export default function(
	userProfile: DeserializedUserProfile<"roles"|"department">,
	department: DeserializedDepartmentResource
): DepartmentManagementInfo {
	const isDeleted = Boolean(department.deletedAt)
	const departments = userProfile.data.departments.data

	const mayUpdateDepartment = permissionGroup.hasOneRoleAllowed(departments, [ UPDATE ])

	const mayArchiveDepartment = permissionGroup.hasOneRoleAllowed(departments, [
		ARCHIVE_AND_RESTORE
	])

	const mayRestoreDepartment = permissionGroup.hasOneRoleAllowed(departments, [
		ARCHIVE_AND_RESTORE
	])

	return {
		isDeleted,
		mayArchiveDepartment,
		mayRestoreDepartment,
		mayUpdateDepartment
	}
}
