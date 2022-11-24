import {
	PermissionMap,
	PermissionInfo,
	LevelPermission,
	OperationPermission,

	VIEW,
	CREATE,
	UPDATE,
	ARCHIVE_AND_RESTORE,
	WRITE_OVERALL_SCOPE,
	READ_OVERALL_SCOPE,

	READ_SCOPE_MASK,
	WRITE_SCOPE_MASK
} from "$/types/permission"

import PermissionGroup from "$/permissions/base"

const profanityColumnName = "profanityFlags"

type ProfanityFlags = { [profanityColumnName]: number }
export type Permissions =
	| OperationPermission
	| Extract<LevelPermission, "readOverallScope" | "writeOverallScope">

/**
 * Permission group for profanity.
 *
 * This is safe to use in client-side.
 */
export default class extends PermissionGroup<ProfanityFlags, Permissions> {
	get name(): string { return profanityColumnName }

	get permissions(): PermissionMap<Permissions> {
		return new Map<Permissions, PermissionInfo<Permissions>>([
			[ "view", {
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

			[ "readOverallScope", {
				"flag": READ_OVERALL_SCOPE,
				"mask": READ_SCOPE_MASK,
				"permissionDependencies": [ ]
			} ],
			[ "writeOverallScope", {
				"flag": WRITE_OVERALL_SCOPE,
				"mask": WRITE_SCOPE_MASK,
				"permissionDependencies": [ "readOverallScope" ]
			} ]
		])
	}
}
