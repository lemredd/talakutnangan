import {
	PermissionMap,
	PermissionInfo,
	LevelPermission,
	OperationPermission,
	VIEW,
	CREATE,
	UPDATE,
	WRITE_OWN_SCOPE,
	ARCHIVE_AND_RESTORE,
	WRITE_OVERALL_SCOPE,
	READ_OVERALL_SCOPE,
	READ_DEPARTMENT_SCOPE,
	WRITE_DEPARTMENT_SCOPE
} from "$/types/permission"

import PermissionGroup from "$/permissions/base"
import { post } from "$/permissions/permission_list"
import { Permissions as PostPermissions } from "$/permissions/post"

const commentColumnName = "commentFlags"

type CommentFlags = { [commentColumnName]: number, "postFlags": number }
export type Permissions =
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
			[ "view", {
				"externalPermissionDependencies": [
					{
						"group": post,
						"permissionDependencies": [ "view" ] as PostPermissions[]
					}
				],
				"flag": VIEW,
				"permissionDependencies": []
			} ],
			[ "create", {
				"flag": CREATE,
				"permissionDependencies": [ "view" ]
			} ],
			[ "update", {
				"flag": UPDATE,
				"permissionDependencies": [ "view" ]
			} ],
			[ "archiveAndRestore", {
				"flag": ARCHIVE_AND_RESTORE,
				"permissionDependencies": [ "view" ]
			} ],
			[ "readDepartmentScope", {
				"externalPermissionDependencies": [
					{
						"group": post,
						"permissionDependencies": [ "readDepartmentScope" ] as PostPermissions[]
					}
				],
				"flag": READ_DEPARTMENT_SCOPE,
				"permissionDependencies": [ ]
			} ],
			[ "readOverallScope", {
				"externalPermissionDependencies": [
					{
						"group": post,
						"permissionDependencies": [ "readOverallScope" ] as PostPermissions[]
					}
				],
				"flag": READ_OVERALL_SCOPE,
				"permissionDependencies": [ ]
			} ],
			[ "writeOwnScope", {
				"flag": WRITE_OWN_SCOPE,
				"permissionDependencies": [ ]
			} ],
			[ "writeDepartmentScope", {
				"flag": WRITE_DEPARTMENT_SCOPE,
				"permissionDependencies": [ "readDepartmentScope" ]
			} ],
			[ "writeOverallScope", {
				"flag": WRITE_OVERALL_SCOPE,
				"permissionDependencies": [ "readOverallScope" ]
			} ],
			[ "vote", {
				"flag": 0x0100,
				"permissionDependencies": [ "view" ]
			} ]
		])
	}
}
