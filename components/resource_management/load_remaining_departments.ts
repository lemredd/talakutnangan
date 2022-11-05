import type { Ref } from "vue"
import type { DeserializedDepartmentListDocument } from "$/types/documents/department"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import Fetcher from "$@/fetchers/department"
import loadRemainingResource from "$@/helpers/load_remaining_resource"

export default async function loadRemainingDepartments(
	departments: Ref<DeserializedDepartmentListDocument>,
	fetcher: Fetcher
): Promise<void> {
	await loadRemainingResource(departments, fetcher, () => ({
		"filter": {
			"existence": "exists",
			"slug": ""
		},
		"page": {
			"limit": DEFAULT_LIST_LIMIT,
			"offset": departments.value.data.length
		},
		"sort": [ "fullName" ]
	}))
}
