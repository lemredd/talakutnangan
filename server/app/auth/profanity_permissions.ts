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
	ARCHIVE_AND_RESTORE,
	WRITE_OVERALL_SCOPE,
	READ_OVERALL_SCOPE
} from "!/types/independent"

import PermissionGroup from "!/bases/permission_group"

const profanityColumnName = "profanityFlags"

type ProfanityFlags = { [profanityColumnName]: number }
type Permissions =
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
			[ "view",              { flag: VIEW, permissionDependencies: [] } ],
			[ "create",            { flag: CREATE, permissionDependencies: [ "view" ] } ],
			[ "update",            { flag: UPDATE, permissionDependencies: [ "view" ] } ],
			[ "archiveAndRestore", { flag: ARCHIVE_AND_RESTORE, permissionDependencies: [ "view" ] } ],

			[ "readOverallScope",     { flag: READ_OVERALL_SCOPE, permissionDependencies: [ ] } ],
			[ "writeOverallScope", {
				flag: WRITE_OVERALL_SCOPE,
				permissionDependencies: [ "readOverallScope" ]
			} ]
		])
	}
}
