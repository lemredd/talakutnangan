import type { PermissionMap, PermissionInfo } from "$/types/server"

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
		return this.doesMatch(role[this.name], mask)
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

	/**
	 *
	 */
	deserialize(flags: number): U[] {
		const permissions = this.permissions
		const names: U[] = []
		for(const [ key, value ] of permissions.entries()) {
			if (this.doesMatch(flags, value.flag)) {
				names.push(key)
			}
		}

		return names
	}

	/**
	 * Returns true if there is at least one role allowed.
	 *
	 * @param roles Roles available to a certain user.
	 * @param permissionCombinations Possible permission that may a role.
	 */
	hasOneRoleAllowed(roles: T[], permissionCombinations: U[][]): boolean {
		return permissionCombinations
			.reduce((previousPermittedCombination: boolean, combination: U[]) => {
				// Use logical OR to match one of the permission combinations
				return previousPermittedCombination || roles.reduce((
					previousPermittedRole: boolean,
					role: T
				) => {
					// Use logical OR to match one of the roles
					return previousPermittedRole || this.mayAllow(role, ...combination)
				}, false)
		}, false)
	}

	private doesMatch(flags: number, targetFlag: number): boolean {
		return (flags & targetFlag) === targetFlag
	}
}
