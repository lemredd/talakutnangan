import type {
	PermissionMap,
	PermissionInfo,
	LevelPermission,
	OperationPermission
} from "$/types/server"

import {
	VIEW,
	CREATE,
	UPDATE,
	READ_OWN_SCOPE,
	WRITE_OWN_SCOPE,
	ARCHIVE_AND_RESTORE,
	WRITE_OVERALL_SCOPE,
	READ_OVERALL_SCOPE,
	READ_DEPARTMENT_SCOPE,
	WRITE_DEPARTMENT_SCOPE
} from "$/types/server"

import PermissionGroup from "!/bases/permission_group"

const profileColumnName = "profileFlags"

type ProfileFlags = { [profileColumnName]: number }
type Permissions =
	| OperationPermission
	| LevelPermission
	| "resetPassword"

/**
 * Permission group for profiles.
 *
 * This is safe to use in client-side.
 */
export default class extends PermissionGroup<ProfileFlags, Permissions> {
	get name(): string { return profileColumnName }

	get permissions(): PermissionMap<Permissions> {
		return new Map<Permissions, PermissionInfo<Permissions>>([
			[ "view",              { flag: VIEW, permissionDependencies: [] } ],
			[ "create",            { flag: CREATE, permissionDependencies: [ "view" ] } ],
			[ "update",            { flag: UPDATE, permissionDependencies: [ "view" ] } ],
			[ "archiveAndRestore", { flag: ARCHIVE_AND_RESTORE, permissionDependencies: [ "view" ] } ],

			[ "readOwnScope",        { flag: READ_OWN_SCOPE, permissionDependencies: [ ] } ],
			[ "readDepartmentScope", { flag: READ_DEPARTMENT_SCOPE, permissionDependencies: [ ] } ],
			[ "readOverallScope",    { flag: READ_OVERALL_SCOPE, permissionDependencies: [ ] } ],
			[ "writeOwnScope",       {
				flag: WRITE_OWN_SCOPE,
				permissionDependencies: [ "readOwnScope" ]
			} ],
			[ "writeDepartmentScope", {
				flag: WRITE_DEPARTMENT_SCOPE,
				permissionDependencies: [ "readDepartmentScope" ]
			} ],
			[ "writeOverallScope", {
				flag: WRITE_OVERALL_SCOPE,
				permissionDependencies: [ "readOverallScope" ]
			} ],

			[ "resetPassword", { flag: 0x0100, permissionDependencies: [ "update" ] } ],
		])
	}
}
