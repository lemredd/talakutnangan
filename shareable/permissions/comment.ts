import {
	PermissionMap,
	PermissionInfo,
	LevelPermission,
	OperationPermission,

	VIEW,
	CREATE,
	UPDATE,
	ARCHIVE_AND_RESTORE,

	WRITE_OWN_SCOPE,
	WRITE_OVERALL_SCOPE,
	READ_OVERALL_SCOPE,
	READ_DEPARTMENT_SCOPE,
	WRITE_DEPARTMENT_SCOPE,

	READ_SCOPE_MASK,
	WRITE_SCOPE_MASK
} from "$/types/permission"

import PermissionGroup from "$/permissions/base"
import PostPermissionGroup, { Permissions as PostPermissions } from "$/permissions/post"

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
	private post: PostPermissionGroup

	constructor(post: PostPermissionGroup) {
		super()
		this.post = post
	}

	get name(): string { return commentColumnName }

	get permissions(): PermissionMap<Permissions> {
		return new Map<Permissions, PermissionInfo<Permissions>>([
			[ "view", {
				"externalPermissionDependencies": [
					{
						"group": this.post,
						"permissionDependencies": [ "view" ] as PostPermissions[]
					}
				],
				"flag": VIEW,
				"mask": VIEW,
				"permissionDependencies": []
			} ],
			[ "create", {
				"flag": CREATE,
				"mask": CREATE,
				"permissionDependencies": [ "view" ]
			} ],
			[ "update", {
				"flag": UPDATE,
				"mask": UPDATE,
				"permissionDependencies": [ "view" ]
			} ],
			[ "archiveAndRestore", {
				"flag": ARCHIVE_AND_RESTORE,
				"mask": ARCHIVE_AND_RESTORE,
				"permissionDependencies": [ "view" ]
			} ],
			[ "readDepartmentScope", {
				"externalPermissionDependencies": [
					{
						"group": this.post,
						"permissionDependencies": [ "readDepartmentScope" ] as PostPermissions[]
					}
				],
				"flag": READ_DEPARTMENT_SCOPE,
				"mask": READ_SCOPE_MASK,
				"permissionDependencies": [ ]
			} ],
			[ "readOverallScope", {
				"externalPermissionDependencies": [
					{
						"group": this.post,
						"permissionDependencies": [ "readOverallScope" ] as PostPermissions[]
					}
				],
				"flag": READ_OVERALL_SCOPE,
				"mask": READ_SCOPE_MASK,
				"permissionDependencies": [ ]
			} ],
			[ "writeOwnScope", {
				"flag": WRITE_OWN_SCOPE,
				"mask": WRITE_SCOPE_MASK,
				"permissionDependencies": [ "readDepartmentScope" ]
			} ],
			[ "writeDepartmentScope", {
				"flag": WRITE_DEPARTMENT_SCOPE,
				"mask": WRITE_SCOPE_MASK,
				"permissionDependencies": [ "readDepartmentScope" ]
			} ],
			[ "writeOverallScope", {
				"flag": WRITE_OVERALL_SCOPE,
				"mask": WRITE_SCOPE_MASK,
				"permissionDependencies": [ "readOverallScope" ]
			} ],
			[ "vote", {
				"flag": 0x0100,
				"mask": 0x0100,
				"permissionDependencies": [ "view" ]
			} ]
		])
	}
}
