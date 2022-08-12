import { mount } from "@vue/test-utils"
import FlagSelector from "./flag_selector.vue"

import { post } from "$/permissions/permission_list"
import { ref } from "vue"

describe("Component: Role/Flag Selector", () => {
	it("should check flag depependency/ies", async() => {
		const wrapper = mount(FlagSelector, {
			"props": {
				"header": "Post",
				"basePermissionGroup": post,
				"flags": 0
			}
		})

		const dependentCheckbox = wrapper.find("input[value='create']")
		const dependencyCheckbox = wrapper.find("input[value='view']")
		await dependentCheckbox.trigger("change")

		const updates = wrapper.emitted("update:flags")
		const expectedFlagValue = 3
		expect(updates).toHaveLength(1)
		expect(updates![0]).toEqual([ expectedFlagValue ])
	})
	it("should increase flags on selection of access level", async() => {
		const wrapper = mount(FlagSelector, {
			"props": {
				"header": "Post",
				"basePermissionGroup": post,
				"flags": 0
			}
		})

		const readAccessLevelFlags = wrapper.find("#read-scope")
		await readAccessLevelFlags.setValue("readDepartmentScope")

		const updates = wrapper.emitted("update:flags")
		const expectedFlagValue = post.generateMask("readDepartmentScope")
		expect(updates![0]).toEqual([ expectedFlagValue ])
	})
})
