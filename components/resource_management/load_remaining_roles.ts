import type { Ref } from "vue"
import type { ResourceCount } from "$/types/documents/base"
import type { DeserializedRoleResource } from "$/types/documents/role"

import Fetcher from "$@/fetchers/role"

export default async function loadRemainingRoles(
	roles: Ref<DeserializedRoleResource[]>,
	fetcher: Fetcher
): Promise<void> {
	await fetcher.list({
		"filter": {
			"department": "*",
			"existence": "exists",
			"slug": ""
		},
		"page": {
			"limit": 10,
			"offset": roles.value.length
		},
		"sort": [ "name" ]
	}).then(response => {
		const { data, meta } = response.body

		if (data.length === 0) return Promise.resolve()

		roles.value = [ ...roles.value, ...data ]

		const castMeta = meta as ResourceCount
		if (roles.value.length < castMeta.count) {
			return loadRemainingRoles(roles, fetcher)
		}

		return Promise.resolve()
	})
}
