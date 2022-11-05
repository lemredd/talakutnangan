import { ref } from "vue"

import type { DeserializedDepartmentListDocument } from "$/types/documents/department"

import Fetcher from "$@/fetchers/department"
import RequestEnvironment from "$/singletons/request_environment"

import loadRemainingDepartments from "./load_remaining_departments"

describe("Helper: Load remaining departments", () => {
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
		const departments = ref<DeserializedDepartmentListDocument>({
			"data": [],
			"meta": {
				"count": 0
			}
		})

		await loadRemainingDepartments(departments, fetcher)

		expect(fetch).toHaveBeenCalledTimes(1)
	})
})
