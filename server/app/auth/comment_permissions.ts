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
	WRITE_OWN_SCOPE,
	ARCHIVE_AND_RESTORE,
	WRITE_OVERALL_SCOPE,
	READ_OVERALL_SCOPE,
	READ_DEPARTMENT_SCOPE,
	WRITE_DEPARTMENT_SCOPE
} from "$/types/server"

import PermissionGroup from "!/bases/permission_group"

const commentColumnName = "commentFlags"

type CommentFlags = { [commentColumnName]: number }
type Permissions =
	| OperationPermission
	| Exclude<LevelPermission, "readOwnScope">
	| "vote"

/**
 * Permission group for comments.
 *
 * This is safe to use in client-side.
 */
export default class extends PermissionGroup<CommentFlags, Permissions> {
	get name(): string { return commentColumnName }

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

			[ "vote", { flag: 0x0100, permissionDependencies: [ "view" ] } ],
		])
	}
}
