import type { Ref } from "vue"
import type { GenericFetcherParameters, QueryParameters } from "$@/types/independent"
import type {
	ResourceIdentifier,
	Attributes,

	Resource,
	DeserializedResource,

	ResourceDocument,
	ResourceListDocument,

	DeserializedResourceDocument,
	DeserializedResourceListDocument,

	ResourceCount
} from "$/types/documents/base"

import Fetcher from "$@/fetchers/base"

export default async function loadRemainingResources<
	// Type of resource identifier necessary to fill other generics
	T extends ResourceIdentifier<"read">,
	// Type of serialized attribute necessary to fill other generics
	U extends Attributes<"serialized">,
	// Type of deserialized attribute necessary to fill other generics
	V extends Attributes<"deserialized">,
	// Type of resource necessary to fill other generics
	W extends Resource<"read", T, U>,
	// Type of deserialized resource necessary to fill other generics
	X extends DeserializedResource<T, V>,
	// Type of resource document to be returned by the some possible readers.
	Y extends ResourceDocument<"read", T, U, W>,
	// Type of resource list document to be returned by the some possible readers
	Z extends ResourceListDocument<"read", T, U, W>,
	// Type of deserialized resource document to be returned by the `read()` and other s
	A extends DeserializedResourceDocument<T, V, X>,
	// Type of desrialized resource list document to be returned by the `list()` and others
	B extends DeserializedResourceListDocument<T, V, X>,
	// Type of response other than resource document to be returned by the some possible readers
	C extends Partial<GenericFetcherParameters> = Record<string, unknown>
>(
	listDocument: Ref<B>,
	fetcher: Fetcher<T, U, V, W, X, Y, Z, A, B, C>,
	queryMaker: () => QueryParameters<C>,
	{
		delayer = () => Promise.resolve(),
		postOperations = () => Promise.resolve(),
		mayContinue = () => Promise.resolve(true)
	}: Partial<{
		delayer: () => Promise<void>
		postOperations: (newList: B) => Promise<void>
		mayContinue: () => Promise<boolean>
	}> = {}
): Promise<void> {
	await delayer()
	await fetcher.list(queryMaker()).then(response => {
		const { data, meta } = response.body

		if (data.length === 0) return Promise.resolve()

		listDocument.value = {
			...listDocument.value,
			"data": [
				...listDocument.value.data,
				...data
			],
			"meta": {
				...listDocument.value.meta,
				...meta
			}
		}

		const castMeta = meta as ResourceCount
		return mayContinue().then(mayContinueLooping => {
			if (mayContinueLooping && listDocument.value.data.length < castMeta.count) {
				return postOperations(response.body)
				.then(() => loadRemainingResources(listDocument, fetcher, queryMaker, {
					delayer,
					postOperations
				}))
			}

			return Promise.resolve()
		})
	})
}
