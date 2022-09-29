import { shallowMount, mount } from "@vue/test-utils"

import type { OptionInfo } from "$@/types/component"

import Component from "./multi-selectable_options.vue"

describe("Component: fields/multi-selectable_options", () => {
	it("should emit custom event", async() => {
		const wrapper = mount<any>(Component, {
			"global": {
				"stubs": {
					"SelectableOptionsField": false
				}
			},
			"props": {
				"label": "Sample multi-select",
				"modelValue": [],
				"options": [ { "value": "1" }, { "value": "2" }, { "value": "3" } ] as OptionInfo[]
			}
		})

		const dropdown = wrapper.findComponent({ "name": "SelectableOptionsField" })
		console.log(dropdown.html(), "\n\n\n")
		const addButton = dropdown.find("button")
		await dropdown.setValue("2")
		await addButton.trigger("click")

		const events = wrapper.emitted()
		expect(events).toHaveProperty("update:modelValue.0.0", [ "2" ])
	})

	it("can add current option", async() => {
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"stubs": {
					"SelectableOptionsField": false
				}
			},
			"props": {
				"label": "Sample multi-select",
				"modelValue": [ "2" ],
				"options": [ { "value": "1" }, { "value": "2" }, { "value": "3" } ] as OptionInfo[]
			}
		})

		const dropdown = wrapper.findComponent({ "name": "SelectableOptionsField" })
		const addButton = dropdown.find("button")
		await dropdown.setValue("1")
		await addButton.trigger("click")

		const events = wrapper.emitted()
		expect(events).toHaveProperty("update:modelValue.0.0", [ "2", "1" ])
	})

	it("can remove one selected option", async() => {
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"label": "Sample multi-select",
				"modelValue": [ "1", "2" ],
				"options": [ { "value": "1" }, { "value": "2" }, { "value": "3" } ] as OptionInfo[]
			}
		})

		const selectedOptions = wrapper.find(".selected-options")
		await selectedOptions.find("li:last-of-type button").trigger("click")

		const events = wrapper.emitted()
		expect(events).toHaveProperty("update:modelValue.0.0", [ "1" ])
	})

	it("can remove only selected option", async() => {
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"label": "Sample multi-select",
				"modelValue": [ "2" ],
				"options": [ { "value": "1" }, { "value": "2" }, { "value": "3" } ] as OptionInfo[]
			}
		})

		const selectedOptions = wrapper.find(".selected-options")
		await selectedOptions.find("li:last-of-type button").trigger("click")

		const events = wrapper.emitted()
		expect(events).toHaveProperty("update:modelValue.0.0", [ ])
	})

	it("can reduce selectable options", () => {
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"stubs": {
					"SelectableOptionsField": false
				}
			},
			"props": {
				"label": "Sample multi-select",
				"modelValue": [ "2" ],
				"options": [ { "value": "1" }, { "value": "2" }, { "value": "3" } ] as OptionInfo[]
			}
		})

		const dropdown = wrapper.findComponent({ "name": "SelectableOptionsField" })
		const options = dropdown.findAll("option")

		// `Disabled` option + 2 remaining options
		expect(options).toHaveLength(3)
		expect(options[0].element).toHaveProperty("value", "")
		expect(options[1].element).toHaveProperty("value", "1")
		expect(options[2].element).toHaveProperty("value", "3")
	})

	it("can show selected options", () => {
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"label": "Sample multi-select",
				"modelValue": [ "1", "2" ],
				"options": [ { "value": "1" }, { "value": "2" }, { "value": "3" } ] as OptionInfo[]
			}
		})

		const selectedOptions = wrapper.find(".selected-options").html()

		expect(selectedOptions).toContain("1")
		expect(selectedOptions).toContain("2")
	})

	it("should show label", () => {
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"stubs": {
					"SelectableOptionsField": false
				}
			},
			"props": {
				"label": "Sample multi-select",
				"modelValue": [],
				"options": [ { "value": "1" } ] as OptionInfo[]
			}
		})

		const HTMLString = wrapper.html()

		expect(HTMLString).toContain("Sample multi-select")
	})
})
