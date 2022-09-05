import { shallowMount } from "@vue/test-utils"
import FlagSelector from "./flag_selector.vue"

import { post, comment } from "$/permissions/permission_list"

describe("Component: role/flag_selector", () => {
	it("should check internal flag depependencies", async() => {
		const wrapper = shallowMount<any>(FlagSelector, {
			"props": {
				"basePermissionGroup": post,
				"header": "Post",
				"modelValue": 0
			}
		})

		const dependentCheckbox = wrapper.findComponent({ "name": "Checkbox" })
		await dependentCheckbox.setValue([ "create" ])

		const internalUpdates = wrapper.emitted("update:modelValue")
		const expectedFlagValue = post.generateMask("create", "view")
		expect(internalUpdates).toHaveProperty("0.0", expectedFlagValue)
		expect(internalUpdates).not.toHaveProperty("1")
	})

	it("should increase internal flags on selection of access level", async() => {
		const wrapper = shallowMount<any>(FlagSelector, {
			"props": {
				"basePermissionGroup": post,
				"header": "Post",
				"modelValue": 0
			}
		})

		const readAccessLevelFlags = wrapper.findComponent({ "name": "AccessLevelSelector" })
		await readAccessLevelFlags.setValue("readDepartmentScope")

		const internalUpdates = wrapper.emitted("update:modelValue")
		const expectedFlagValue = post.generateMask("readDepartmentScope")
		expect(internalUpdates).toHaveProperty("0.0", expectedFlagValue)
		expect(internalUpdates).not.toHaveProperty("1")
	})

	it("should check external dependency flags", async() => {
		const wrapper = shallowMount<any>(FlagSelector, {
			"props": {
				"basePermissionGroup": comment,
				"header": "Comment",
				"modelValue": 0
			}
		})

		const dependentCheckbox = wrapper.findComponent({ "name": "Checkbox" })
		await dependentCheckbox.setValue([ "view" ])

		const internalUpdates = wrapper.emitted("update:modelValue")
		const expectedFlagValue = comment.generateMask("view")
		expect(internalUpdates).toHaveProperty("0.0", expectedFlagValue)
		const externalUpdates = wrapper.emitted("checkExternalDependencyFlags")
		expect(externalUpdates).toHaveProperty("0.0.0.group", post)
		expect(externalUpdates).toHaveProperty("0.0.0.permissionDependencies", [ "view" ])
		expect(externalUpdates).not.toHaveProperty("0.0.1")
	})

	it("should uncheck internal dependent flags", async() => {
		const wrapper = shallowMount<any>(FlagSelector, {
			"props": {
				"basePermissionGroup": post,
				"header": "Post",
				"modelValue": post.generateMask("create", "view")
			}
		})

		const dependentCheckbox = wrapper.findComponent({ "name": "Checkbox" })
		await dependentCheckbox.setValue([ "create" ])

		const internalUpdates = wrapper.emitted("update:modelValue")
		const expectedFlagValue = 0
		expect(internalUpdates).toHaveLength(1)
		expect(internalUpdates).toHaveProperty("0.0", expectedFlagValue)
	})

	it("should uncheck external dependency flags", async() => {
		const wrapper = shallowMount<any>(FlagSelector, {
			"props": {
				"basePermissionGroup": post,
				"dependentPermissionGroups": [ comment ],
				"header": "Comment",
				"modelValue": post.generateMask("view")
			}
		})

		const dependentCheckbox = wrapper.findComponent({ "name": "Checkbox" })
		await dependentCheckbox.setValue([])

		const internalUpdates = wrapper.emitted("update:modelValue")
		const expectedFlagValue = 0
		expect(internalUpdates).toHaveProperty("0.0", expectedFlagValue)
		const externalUpdates = wrapper.emitted("uncheckExternallyDependentFlags")
		expect(externalUpdates).toHaveProperty("0.0.0.group", comment)
		expect(externalUpdates).toHaveProperty("0.0.0.permissionDependencies", [
			"view",
			"create",
			"update",
			"archiveAndRestore",
			"vote"
		])
		expect(externalUpdates).not.toHaveProperty("0.0.1")
	})
})
