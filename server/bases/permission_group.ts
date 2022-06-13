import type { PermissionMap } from "!/types/independent"

/**
 * Base class for permission groups.
 *
 * This is safe to use in client-side. Useful to check if a certain operation is safe to be
 * executed.
 */
export default abstract class<T extends { [key: string]: number }, U> {
	/**
	 * Name of the permission group
	 */
	abstract get name(): string

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
		const mask = this.generateMask(permissionName)
		return (role[this.name] & mask) === mask
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
		const info = permissions.get(name) || { flag: 0, permissionDependencies: [] }
		return info.flag | info.permissionDependencies.reduce((a, b) => a | this.generateMask(b), 0);
	}
}
