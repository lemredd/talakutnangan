import type { PermissionMap } from "!/types/independent"

/**
 * Base class for permission groups.
 *
 * Useful to check if a certain operation is safe to be executed.
 */
export default abstract class<T extends { [key: string]: number }, U> {
	/**
	 * Map of permissions under the group
	 */
	abstract get permissions(): PermissionMap<U>

	/**
	 * Returns true if role is permitted. Otherwise, false.
	 *
	 * @param role An object which contains flags named under a permission group name.
	 * @param permissionName Name of the permission to check if it is allowed in the role.
	 */
	mayAllow(role: T, permissionName: U): boolean {
		// TODO: Create a recursive function to check the flags
		return false
	}

	/**
	 * Generates mask to the permission.
	 *
	 * This mask includes the flags of permission dependencies.
	 *
	 * @param name Name of the permission to generate its mask
	 */
	generateMask(name: U): number {
		const permissions = this.permissions
		const info = permissions.get(name)
		return info.flag | info.permissionDependencies.reduce((a, b) => a | this.generateMask(b), 0);
	}
}
