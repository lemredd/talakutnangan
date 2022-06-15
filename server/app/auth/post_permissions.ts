import type {
	PermissionMap,
	PermissionInfo,
	LevelPermission,
	OperationPermission
} from "!/types/independent"

import {
	VIEW,
	CREATE,
	UPDATE,
	WRITE_OWN_SCOPE,
	ARCHIVE_AND_RESTORE,
	WRITE_OVERALL_SCOPE,
	READ_OVERALL_SCOPE,
	READ_DEPARTMENT_SCOPE,
	WRITE_DEPARTMENT_SCOPE
} from "!/types/independent"

import PermissionGroup from "!/bases/permission_group"

const postColumnName = "postFlags"

type PostFlags = { [postColumnName]: number }
type Permissions =
	| OperationPermission
	| Exclude<LevelPermission, "readOwnScope">
	| "tag"

/**
 * Permission group for post.
 *
 * This is safe to use in client-side.
 */
export default class extends PermissionGroup<PostFlags, Permissions> {
	get name(): string { return postColumnName }

	get permissions(): PermissionMap<Permissions> {
		return new Map<Permissions, PermissionInfo<Permissions>>([
			[ "view",              { flag: VIEW, permissionDependencies: [] } ],
			[ "create",            { flag: CREATE, permissionDependencies: [ "view" ] } ],
			[ "update",            { flag: UPDATE, permissionDependencies: [ "view" ] } ],
			[ "archiveAndRestore", { flag: ARCHIVE_AND_RESTORE, permissionDependencies: [ "view" ] } ],

			[ "readDepartmentScope",  { flag: READ_DEPARTMENT_SCOPE, permissionDependencies: [ ] } ],
			[ "readOverallScope",     { flag: READ_OVERALL_SCOPE, permissionDependencies: [ ] } ],
			[ "writeOwnScope",        { flag: WRITE_OWN_SCOPE, permissionDependencies: [ ] } ],
			[ "writeDepartmentScope", {
				flag: WRITE_DEPARTMENT_SCOPE,
				permissionDependencies: [ "readDepartmentScope" ]
			} ],
			[ "writeOverallScope", {
				flag: WRITE_OVERALL_SCOPE,
				permissionDependencies: [ "readOverallScope" ]
			} ],

			[ "tag", { flag: 0x0100, permissionDependencies: [ "view" ] } ],
		])
	}
}
