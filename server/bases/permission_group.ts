import type { PermissionMap, PermissionInfo } from "!/types/independent"

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
	 * Returns true if all stated permissions are allowed for the role. Otherwise, false.
	 *
	 * @param role An object which contains flags named under a permission group name.
	 * @param permissionNames Name of the permission(s) to check if they are allowed in the role.
	 */
	mayAllow(role: T, ...permissionNames: U[]): boolean {
		const mask = this.generateMask(...permissionNames)
		return (role[this.name] & mask) === mask
	}

	/**
	 * Generates mask of the permission(s).
	 *
	 * The mask includes the flags of permission dependencies.
	 *
	 * @param names Name of the permission to generate its mask
	 */
	generateMask(...names: U[]): number {
		const permissions = this.permissions
		return names.reduce((combinedMask, name) => {
			const info: PermissionInfo<U> = permissions.get(name)
				|| { flag: 0, permissionDependencies: [] }
			return combinedMask
				| info.permissionDependencies.reduce((dependentMask, dependentName) => {
					return dependentMask | this.generateMask(dependentName)
				}, info.flag)
		}, 0)
	}
}
