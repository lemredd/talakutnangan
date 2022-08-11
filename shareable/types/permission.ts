/**
 * Used to define the information about a certain permission.
 */
export interface PermissionInfo<T> {
	flag: number,
	permissionDependencies: T[]
}

/**
 * Used to define a group of permissions.
 */
export type PermissionMap<T> = Map<T, PermissionInfo<T>>

/**
 * Array of permissions that dictate the CRUD operations
 */
export const rawOperationPermissions = [ "view", "create", "update", "archiveAndRestore" ] as const

/**
 * Union of raw operation permissions.
 */
export type OperationPermission = typeof rawOperationPermissions[number]

/**
 * Array of permissions that dictate the administration level of read and write operations.
 */
export const rawLevelPermissions = [
	 "readOwnScope",
	 "readDepartmentScope",
	 "readOverallScope",
	 "writeOwnScope",
	 "writeDepartmentScope",
	 "writeOverallScope"
] as const

/**
 * Union of raw level permissions.
 */
export type LevelPermission = typeof rawLevelPermissions[number]

/*
 * Used to set the flag of a common permission prventing errors in the future.
 * Special flag(s) of a permission group should have flags > 0x00FF or 0b1100_0000.
 */
export const VIEW							= 0x0001
export const CREATE						= 0x0002
export const UPDATE						= 0x0004
export const ARCHIVE_AND_RESTORE		= 0x0008
export const READ_OWN_SCOPE			= 0x0010
export const READ_DEPARTMENT_SCOPE	= 0x0020
export const READ_OVERALL_SCOPE		= 0x0030
export const WRITE_OWN_SCOPE			= 0x0040
export const WRITE_DEPARTMENT_SCOPE	= 0x0080
export const WRITE_OVERALL_SCOPE		= 0x00C0
