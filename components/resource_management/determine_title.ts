import type PermissionGroup from "$/permissions/base"
import type { DeserializedUserProfile } from "$/types/documents/user"

export default function<T, U extends PermissionGroup<any, T>>(
	userProfile: DeserializedUserProfile<"roles"|"department">,
	permissionGroup: U,
	departmentScope: T[],
	globalScope: T[]
): string {
	const roles = userProfile.data.roles.data
	if (permissionGroup.hasOneRoleAllowed(roles, [ globalScope ])) {
		return "Administrator Configuration"
	} else if (permissionGroup.hasOneRoleAllowed(roles, [ departmentScope ])) {
		const department = userProfile.data.department.data
		if (department.mayAdmit) {
			return `Users of ${department.name}`
		}

		return `Employees of ${department.name}`
	}

	throw new Error("Unauthorized user")
}
