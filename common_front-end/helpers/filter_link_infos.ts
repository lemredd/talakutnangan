import type PermissionGroup from "$/permissions/base"
import type { DeserializedPageContext, ConditionalLinkInfo, LinkInfo } from "$@/types/independent"

import isUndefined from "$/helpers/type_guards/is_undefined"

export default function<T, U extends PermissionGroup<any, T>>(
	context: DeserializedPageContext,
	conditionalLinkInfos: ConditionalLinkInfo<T, U>[]
): LinkInfo[] {
	const { userProfile } = context.pageProps

	const filteredLinkInfos = conditionalLinkInfos.filter(linkInfo => {
		/**
		 * A = user is guest
		 * B = condition states that user must be guest
		 * C = condition states that user must be authenticated
		 * D = condition states that user must be allowed by permission group
		 * E = user have permissions
		 * F = condition states that user must be a certain kind
		 * G = user is a certain kind
		 *
		 * 1. ¬B ∧ ¬C              // Any user is allowed
		 * 2. A ∧ B                // User must be guest
		 * 3. ¬A ∧ C ∧ ¬D ∧ ¬F     // User must be authenticated only
		 * 4. ¬A ∧ C ∧ D ∧ E       // User must be allowed by permission group
		 * 5. ¬A ∧ C ∧ F ∧ G       // User must be a certain kind
		 * 6. // Either of #1, #2, #3, #4, #5
		 *    (¬B ∧ ¬C) ⇎ (A ∧ B) ⇎ (¬A ∧ C ∧ ¬D ∧ ¬F) ⇎ (¬A ∧ C ∧ D ∧ E) ⇎ (¬A ∧ C ∧ F ∧ G)
		 * 7. // Distributive Law
		 *    (¬B ∧ ¬C) ⇎ (A ∧ B) ⇎ (¬A ∧ C ∧ ((¬D ∧ ¬F) ⇎ (D ∧ E) ⇎ (F ∧ G)))
		 * 8. // Rearrange according to most used operation
		 *    (¬A ∧ C ∧ ((¬D ∧ ¬F) ⇎ (F ∧ G) ⇎ (D ∧ E))) ⇎ (A ∧ B) ⇎ (¬B ∧ ¬C)
		 */
		const mayNecesarilyAuthenticated
			= (linkInfo.permissionCombinations !== null || linkInfo.kinds !== null)
			&& userProfile !== null

		const isAuthenticatedOnly = mayNecesarilyAuthenticated
			&& linkInfo.kinds !== null
			&& linkInfo.permissionCombinations !== null
			&& !isUndefined(userProfile)
		const hasMetCertainKind = mayNecesarilyAuthenticated
			&& linkInfo.kinds !== null
			&& !isUndefined(userProfile)
			&& linkInfo.kinds.includes(userProfile.data.kind)
		const hasAllowed = mayNecesarilyAuthenticated
			&& linkInfo.permissionGroup !== null
			&& linkInfo.permissionCombinations !== null
			&& !isUndefined(userProfile)
			&& linkInfo.permissionGroup.hasOneRoleAllowed(
				userProfile.data.roles.data,
				linkInfo.permissionCombinations
			)
		const mustShowByAuthenticatedOnly = isAuthenticatedOnly !== hasMetCertainKind
			|| hasMetCertainKind !== hasAllowed
		const mustShowToGuestOnly = linkInfo.mustBeGuest && userProfile === null
		const mustShowToAll = !linkInfo.mustBeGuest
			&& linkInfo.permissionCombinations === null
			&& linkInfo.kinds === null

		return mustShowByAuthenticatedOnly !== mustShowToGuestOnly
			|| mustShowToGuestOnly !== mustShowToAll
	})

	return filteredLinkInfos.reduce<LinkInfo[]>((previousLinkInfo, currentlinkInfo) => [
		...previousLinkInfo, ...currentlinkInfo.links
	], [])
}
