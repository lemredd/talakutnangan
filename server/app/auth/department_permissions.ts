import type { PermissionMap, PermissionInfo } from "!/types/independent"
import PermissionGroup from "!/bases/permission_group"

const departmentColumnName = "department_flags"

type DepartmentFlags = { [departmentColumnName]: number }
type Permissions =
	| "view"
	| "create"
	| "update"
	| "archiveAndRestore"
	| "readOwnScope"
	| "readOverallScope"
	| "writeOverallScope"
	| "mergeDepartment"

/**
 * Permission group for department.
 *
 * This is safe to use in client-side.
 */
export default class extends PermissionGroup<DepartmentFlags, Permissions> {
	get name(): string { return departmentColumnName }

	get permissions(): PermissionMap<Permissions> {
		return new Map<Permissions, PermissionInfo<Permissions>>([
			[ "view",              { flag: 0x001, permissionDependencies: [] } ],
			[ "create",            { flag: 0x002, permissionDependencies: [ "view" ] } ],
			[ "update",            { flag: 0x004, permissionDependencies: [ "view" ] } ],
			[ "archiveAndRestore", { flag: 0x008, permissionDependencies: [ "view" ] } ],
			[ "readOwnScope",      { flag: 0x010, permissionDependencies: [ "view" ] } ],
			[ "readOverallScope",  { flag: 0x020, permissionDependencies: [ "view" ] } ],
			[ "writeOverallScope", { flag: 0x080, permissionDependencies: [ "view" ] } ],
			[ "mergeDepartment",   {
				flag: 0x100,
				permissionDependencies: [
					"archiveAndRestore", "create"
				]
			} ]
		])
	}
}
