import type { Ref } from "vue"
import type { Existence } from "$/types/query"
import type { ExistenceOperators } from "$@/types/component"
import type { GenericFetcherParameters, Response } from "$@/types/independent"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"
import type {
	ResourceIdentifier,
	Attributes,

	Resource,
	DeserializedResource,

	ResourceDocument,
	ResourceListDocument,

	DeserializedResourceDocument,
	DeserializedResourceListDocument
} from "$/types/documents/base"

import Fetcher from "$@/fetchers/base"

export default function<
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
	list: Ref<B>,
	fetcher: Fetcher<T, U, V, W, X, Y, Z, A, B, C>,
	queryState: {
		existence: Ref<Existence>,
		offset: Ref<number>,
	},
	selectedIDs: Ref<string[]>,
	UIState: {
		isLoaded: Ref<boolean>,
		receivedErrors: Ref<string[]>
	}
): ExistenceOperators {
	function removeData(IDs: string[]) {
		const newData = list.value.data.filter(item => IDs.indexOf(item.id) === -1)

		if (newData.length === 0) {
			queryState.offset.value = Math.max(queryState.offset.value - 1, 0)
		} else {
			list.value = {
				...list.value,
				"data": newData,
				"meta": {
					...list.value.meta,
					"count": newData.length
				}
			}
		}
	}

	function renewExistence(IDs: string[], renew: (resource: X) => X) {
		list.value = {
			...list.value,
			"data": list.value.data.map(item => {
				let newItemData = { ...item }
				if (IDs.indexOf(newItemData.id) > -1) {
					newItemData = renew(newItemData)
				}
				return newItemData
			})
		}
	}

	async function batchOperate(
		IDs: string[],
		operate: () => Promise<Response<T, U, V, W, X, null>>,
		oppositeExistence: Existence,
		renew: (resource: X) => X
	) {
		UIState.isLoaded.value = false
		try {
			await operate()
			if (queryState.existence.value === oppositeExistence) {
				removeData(IDs)
			} else if (queryState.existence.value === "*") {
				renewExistence(IDs, renew)
			}
			selectedIDs.value = selectedIDs.value.filter(selectedID => IDs.indexOf(selectedID) === -1)
		} catch (responseWithErrors) {
			extractAllErrorDetails(
				responseWithErrors as Response<T, U, V, W, X, null>,
				UIState.receivedErrors
			)
		} finally {
			UIState.isLoaded.value = true
		}
	}

	async function batchArchive(IDs: string[]) {
		await batchOperate(IDs, () => fetcher.archive(IDs), "exists", item => ({
			...item,
			"deletedAt": new Date()
		}))
	}

	async function batchRestore(IDs: string[]) {
		await batchOperate(IDs, () => fetcher.restore(IDs), "archived", item => ({
			...item,
			"deletedAt": null
		}))
	}

	async function archive(id: string) {
		await batchArchive([ id ])
	}

	async function restore(id: string) {
		await batchRestore([ id ])
	}

	return {
		archive,
		batchArchive,
		batchRestore,
		restore
	}
}
