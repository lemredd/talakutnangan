import type { PermissionMap } from "!/types/independent"

/**
 * Base class for permission groups.
 *
 * Useful to check if a certain operation is safe to be executed.
 */
export default abstract class {
	/**
	 * Name of the permission group
	 */
	abstract get group(): string

	/**
	 * Map of permissions under the group
	 */
	abstract get permissions(): PermissionMap

	/**
	 * Returns true if role is permitted. Otherwise, false.
	 *
	 * Throws error if the role has no permission group that matches the required name.
	 *
	 * @param role An object which contains flags named under a permission group name.
	 * @param permissionName Name of the permission to check if it is allowed in the role.
	 */
	mayAllow(role: object, permissionName: string): boolean {
		if (this.group in role) {
			// TODO: Create a recursive function to check the flags
			return false
		} else {
			throw new TypeError("Role has no permission group that match the required name.")
		}
	}
}
