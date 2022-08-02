import { ref } from "vue"

import { tag } from "$/permissions/permission_list"
import BasePermissionGroup from "$/permissions/base"
import includePermissionDependencies from "$@/helpers/include_permission_dependencies"

describe("Helper: Include Permission Dependencies", () => {
	it("Should include permission dependencies", () => {
		const rawFlags = ref<string[]>(["update"])
		includePermissionDependencies(tag, rawFlags)

		expect(rawFlags.value).toHaveLength(2)
		expect(rawFlags.value).toContain("view")
	})
})
