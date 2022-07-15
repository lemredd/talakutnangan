import type { Serializable } from "$/types/database"

import deserialize from "$@/helpers/deserialize"

export default function(
	pageContext: Serializable & { pageProps: { userProfile: Serializable|null  } }
): Serializable {
	const restructuredContext = { ...pageContext }
	restructuredContext.pageProps.userProfile = deserialize(
		restructuredContext.pageProps.userProfile
	)
	return restructuredContext
}
