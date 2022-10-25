import type { Ref } from "vue"
import type { ResourceCount } from "$/types/documents/base"
import type { DeserializedDepartmentResource } from "$/types/documents/department"

import DepartmentFetcher from "$@/fetchers/department"

export default async function loadRemainingDepartments(
	departments: Ref<DeserializedDepartmentResource[]>,
	fetcher: DepartmentFetcher
): Promise<void> {
	await fetcher.list({
		"filter": {
			"existence": "exists",
			"slug": ""
		},
		"page": {
			"limit": 10,
			"offset": departments.value.length
		},
		"sort": [ "fullName" ]
	}).then(response => {
		const { data, meta } = response.body

		if (data.length === 0) return Promise.resolve()

		departments.value = [ ...departments.value, ...data ]

		const castMeta = meta as ResourceCount
		if (departments.value.length < castMeta.count) {
			return loadRemainingDepartments(departments, fetcher)
		}

		return Promise.resolve()
	})
}
