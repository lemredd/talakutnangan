import { Ref } from "vue"

import type {
	ResourceIdentifier,
	Attributes,

	DeserializedResource,
	DeserializedResourceListDocument
} from "$/types/documents/base"


export default async function<
	T extends ResourceIdentifier<"read">,
	U extends Attributes<"deserialized">,
	V extends DeserializedResource<T, U>,
	W extends DeserializedResourceListDocument<T, U, V>
>(
	list: Ref<W>,
	receivedErrors: Ref<string[]>,
	selectedIDs: Ref<string[]>,
	fetchResourceInfo: () => Promise<void>
) {
	list.value = {
		...list.value,
		"data": [],
		"meta": {
			...list.value.meta,
			"count": 0
		}
	}
	receivedErrors.value = []
	selectedIDs.value = []

	await fetchResourceInfo()
}
