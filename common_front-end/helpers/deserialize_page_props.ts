import type { Serializable } from "$/types/general"
import type { DeserializedPageContext } from "$@/types/independent"

import deserialize from "$/object/deserialize"

export default function(
	pageContext: Serializable & { pageProps: { userProfile: Serializable|null } }
): DeserializedPageContext {
	const restructuredContext = { ...pageContext } as Serializable
	const castPageProps = restructuredContext.pageProps as Serializable

	restructuredContext.pageProps = Object.getOwnPropertyNames(restructuredContext.pageProps)
	.map(property => ({
		[property]: deserialize(castPageProps[property] as Serializable)
	})).reduce((previousProperties, currentProperty) => ({
		...previousProperties,
		...currentProperty
	}), {} as DeserializedPageContext) as DeserializedPageContext

	return restructuredContext as DeserializedPageContext
}
