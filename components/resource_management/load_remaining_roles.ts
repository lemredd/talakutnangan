import type { Ref } from "vue"
import type { DeserializedRoleListDocument } from "$/types/documents/role"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import Fetcher from "$@/fetchers/role"
import loadRemainingResource from "$@/helpers/load_remaining_resource"

export default async function loadRemainingRoles(
	roles: Ref<DeserializedRoleListDocument>,
	fetcher: Fetcher
): Promise<void> {
	await loadRemainingResource(roles, fetcher, () => ({
		"filter": {
			"department": "*",
			"existence": "exists",
			"slug": ""
		},
		"page": {
			"limit": DEFAULT_LIST_LIMIT,
			"offset": roles.value.data.length
		},
		"sort": [ "name" ]
	}))
}
