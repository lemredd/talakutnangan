import { ref } from "vue"

import type { DeserializedRoleListDocument } from "$/types/documents/role"

import Fetcher from "$@/fetchers/role"
import RequestEnvironment from "$/singletons/request_environment"

import loadRemainingRoles from "./load_remaining_roles"

describe("Helper: Load remaining roles", () => {
	it("should stop loop", async() => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": [],
				"meta": {
					"count": 0
				}
			}),
			{ "status": RequestEnvironment.status.OK }
		)
		const fetcher = new Fetcher()
		const roles = ref<DeserializedRoleListDocument>({
			"data": [],
			"meta": {
				"count": 0
			}
		})

		await loadRemainingRoles(roles, fetcher)

		expect(fetch).toHaveBeenCalledTimes(1)
	})
})
