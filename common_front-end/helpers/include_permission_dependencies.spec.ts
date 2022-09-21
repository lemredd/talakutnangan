import { ref } from "vue"

import { tag } from "$/permissions/permission_list"

import includePermissionDependencies from "./include_permission_dependencies"

describe("Helper: Include permission dependencies", () => {
	it("should include permission dependencies", () => {
		const rawFlags = ref<string[]>([ "update" ])
		includePermissionDependencies(tag, rawFlags)

		expect(rawFlags.value).toHaveLength(2)
		expect(rawFlags.value).toContain("view")
	})
})
