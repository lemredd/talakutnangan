import { mount } from "@vue/test-utils"
import FlagSelector from "./flag_selector.vue"

import { post, comment } from "$/permissions/permission_list"

describe("Component: role/flag_selector", () => {
	it("should check flag depependency/ies", async() => {
		const wrapper = mount(FlagSelector, {
			"props": {
				"basePermissionGroup": post,
				"flags": 0,
				"header": "Post"
			}
		})

		const dependentCheckbox = wrapper.find("input[value='create']")
		await dependentCheckbox.trigger("change")

		const internalUpdates = wrapper.emitted("update:flags")
		const expectedFlagValue = post.generateMask("create", "view")
		expect(internalUpdates).toHaveLength(1)
		expect(internalUpdates).toHaveProperty("0.0", expectedFlagValue)
	})

	it("should increase flags on selection of access level", async() => {
		const wrapper = mount(FlagSelector, {
			"props": {
				"basePermissionGroup": post,
				"flags": 0,
				"header": "Post"
			}
		})

		const readAccessLevelFlags = wrapper.find(".read-scope")
		await readAccessLevelFlags.setValue("readDepartmentScope")

		const internalUpdates = wrapper.emitted("update:flags")
		const expectedFlagValue = post.generateMask("readDepartmentScope")
		expect(internalUpdates).toHaveProperty("0.0", expectedFlagValue)
	})

	it("should check dependent flags on other groups", async() => {
		const wrapper = mount(FlagSelector, {
			"props": {
				"basePermissionGroup": comment,
				"flags": 0,
				"header": "Comment"
			}
		})

		const dependentCheckbox = wrapper.find("input[value='view']")
		await dependentCheckbox.trigger("change")

		const internalUpdates = wrapper.emitted("update:flags")
		const expectedFlagValue = comment.generateMask("view")
		expect(internalUpdates).toHaveProperty("0.0", expectedFlagValue)
		const externalUpdates = wrapper.emitted("update_dependency_flags")
		expect(externalUpdates).toHaveProperty("0.0.0.group", post)
		expect(externalUpdates).toHaveProperty("0.0.0.permissionDependencies", [ "view" ])
		expect(externalUpdates).not.toHaveProperty("0.0.1")
	})
})
