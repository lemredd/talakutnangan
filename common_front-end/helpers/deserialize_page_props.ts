import type { Serializable } from "$/types/general"
import type { DeserializedPageContext } from "$@/types/independent"

import deserialize from "$/helpers/deserialize"

export default function(
	pageContext: Serializable & { pageProps: { userProfile: Serializable|null } }
): DeserializedPageContext {
	const restructuredContext = { ...pageContext }
	restructuredContext.pageProps.userProfile = deserialize(
		restructuredContext.pageProps.userProfile
	)
	return restructuredContext as DeserializedPageContext
}
