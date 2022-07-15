import type { DeserializedPageContext, ConditionalLinkInfo, LinkInfo } from "$@/types/independent"

import type PermissionGroup from "$/permissions/base"

export default function<T, U extends PermissionGroup<any, T>>(
	context: DeserializedPageContext,
	linkInfos: ConditionalLinkInfo<T, U>[]
): LinkInfo[] {
	const { userProfile } = context.pageProps

	linkInfos.filter(linkInfo => {
		/**
		 * A = user is guest
		 * B = condition states that user must be guest
		 * C = condition states that user must be authenticated
		 * D = condition states that user must be allowed by permission group
		 * E = user have permissions
		 *
		 * 1. ¬B ∧ ¬C				// Any user is allowed
		 * 2. A ∧ B					// User must be guest
		 * 3. ¬A ∧ C ∧ ¬D			// User must be authenticated only
		 * 4. ¬A ∧ C ∧ D ∧ E		// User must be allowed by permission group
		 * 5.	// Additon of #1, #2, #3, #4
		 *    (¬B ∧ ¬C) ∨ (A ∧ B) ∨ (¬A ∧ C ∧ ¬D) ∨ (¬A ∧ C ∧ D ∧ E)
		 * 6. // Distributive Law
		 *    (¬B ∧ ¬C) ∨ (A ∧ B) ∨ (¬A ∧ C ∧ (¬D ∨ (D ∧ E)))
		 * 6. // Rearrange according to most used operation
		 *    (¬A ∧ C ∧ (¬D ∨ (D ∧ E))) ∨ (A ∧ B) ∨ (¬B ∧ ¬C)
		 */
		return (
			!linkInfo.mustBeGuest && userProfile != null
			&& (
				linkInfo.perimissionGroup == null
				|| (true /** check if has one role permitted */)
			)
		)
		|| (!linkInfo.mustBeGuest && linkInfo.permissionCombinations == null)
		|| (linkInfo.mustBeGuest && userProfile == null)
	})

	return  []
}
