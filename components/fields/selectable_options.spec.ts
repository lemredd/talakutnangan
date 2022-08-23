import { shallowMount } from "@vue/test-utils"

import type { OptionInfo } from "$@/types/component"

import Component from "./selectable_options.vue"

describe("Component: fields/selectable_options", () => {
	it("should emit custom event", async() => {
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"label": "Sample select",
				"modelValue": "",
				"options": [ { "value": "1" }, { "value": "2" }, { "value": "3" } ] as OptionInfo[]
			}
		})

		const select = wrapper.find("select")
		await select.setValue("2")

		const updates = wrapper.emitted()
		expect(updates).toHaveProperty("update:modelValue")
	})

	it("should not select for missing model value", () => {
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"label": "Sample select",
				"modelValue": "",
				"options": []
			}
		})

		const select = wrapper.find("select").element as HTMLSelectElement
		const currentValue = select.value

		expect(currentValue).toEqual("")
	})

	it("should identify initial value", () => {
		const options = [ { "value": "1" }, { "value": "2" }, { "value": "3" } ] as OptionInfo[]
		const modelValue = options[0].value
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"label": "Sample select",
				modelValue,
				options
			}
		})

		const select = wrapper.find("select").element as HTMLSelectElement
		const identifiedInitialValue = select.value

		expect(Number(identifiedInitialValue)).toEqual(Number(modelValue))
	})

	it("should show default placeholder", () => {
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"label": "Sample select",
				"modelValue": "1",
				"options": [ { "value": "1" } ] as OptionInfo[]
			}
		})

		const option = wrapper.find("option:first-child").element as HTMLOptionElement
		const placeholder = option.text

		expect(placeholder).toEqual("Please select")
	})

	it("should show custom placeholder", () => {
		const customPlaceholder = "Please a role"
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"label": "Sample select",
				"modelValue": "1",
				"options": [ { "value": "1" } ] as OptionInfo[],
				"placeholder": customPlaceholder
			}
		})

		const option = wrapper.find("option:first-child").element as HTMLOptionElement
		const placeholder = option.text

		expect(placeholder).toEqual(customPlaceholder)
	})
})
