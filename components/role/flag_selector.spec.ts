import { shallowMount } from "@vue/test-utils"
import FlagSelector from "./flag_selector.vue"

import { post, comment } from "$/permissions/permission_list"

describe("Component: role/flag_selector", () => {
	it("should check internal flag depependency/ies", async() => {
		const wrapper = shallowMount(FlagSelector, {
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

	it("should increase internal flags on selection of access level", async() => {
		const wrapper = shallowMount(FlagSelector, {
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

	it("should check external dependency flags", async() => {
		const wrapper = shallowMount(FlagSelector, {
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
		const externalUpdates = wrapper.emitted("updateDependencyFlags")
		expect(externalUpdates).toHaveProperty("0.0.0.group", post)
		expect(externalUpdates).toHaveProperty("0.0.0.permissionDependencies", [ "view" ])
		expect(externalUpdates).not.toHaveProperty("0.0.1")
	})

	it("should uncheck internal dependent flags", async() => {
		const wrapper = shallowMount(FlagSelector, {
			"props": {
				"basePermissionGroup": post,
				"flags": post.generateMask("create", "view"),
				"header": "Post"
			}
		})

		const dependentCheckbox = wrapper.find("input[value='view']")
		await dependentCheckbox.trigger("change")

		const internalUpdates = wrapper.emitted("update:flags")
		const expectedFlagValue = 0
		expect(internalUpdates).toHaveLength(1)
		expect(internalUpdates).toHaveProperty("0.0", expectedFlagValue)
	})

	it("should uncheck external dependency flags", async() => {
		const wrapper = shallowMount(FlagSelector, {
			"props": {
				"basePermissionGroup": post,
				"dependentGroups": [ comment ],
				"flags": post.generateMask("view"),
				"header": "Comment"
			}
		})

		const dependentCheckbox = wrapper.find("input[value='view']")
		await dependentCheckbox.trigger("change")

		const internalUpdates = wrapper.emitted("update:flags")
		const expectedFlagValue = 0
		expect(internalUpdates).toHaveProperty("0.0", expectedFlagValue)
		const externalUpdates = wrapper.emitted("updateDependencyFlags")
		expect(externalUpdates).toHaveProperty("0.0.0.group", comment)
		expect(externalUpdates).toHaveProperty("0.0.0.permissionDependents", [ "view" ])
		expect(externalUpdates).not.toHaveProperty("0.0.1")
	})
})
