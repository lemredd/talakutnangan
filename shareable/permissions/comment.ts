import {
	PermissionMap,
	PermissionInfo,
	LevelPermission,
	OperationPermission,
	VIEW,
	CREATE,
	UPDATE,
	ARCHIVE_AND_RESTORE
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
			} ]
		])
	}
}
