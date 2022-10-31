import { shallowMount } from "@vue/test-utils"

import type { OptionInfo } from "$@/types/component"

import Component from "./selectable_checkbox.vue"

describe("Component: fields/selectable_checkbox", () => {
	it("should emit custom event", async() => {
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"label": "Sample select",
				"modelValue": "",
				"options": [ { "value": "1" }, { "value": "2" }, { "value": "3" } ] as OptionInfo[]
			}
		})

		const checkbox = wrapper.findAll("input[type=checkbox]")
		const [ unusedfirstOption, secondOption ] = checkbox
		const secondOptionElement = secondOption.element as HTMLInputElement
		secondOptionElement.select()
		await secondOption.trigger("change")

		const updates = wrapper.emitted()
		expect(updates).toHaveProperty("update:modelValue")
	})

	it("should not load empty options", () => {
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"label": "Sample select",
				"modelValue": "",
				"options": [] as OptionInfo[]
			}
		})

		const checkbox = wrapper.find("input[type=checkbox]")

		expect(checkbox.exists()).toBeFalsy()
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

		const checkbox = wrapper.find("input[type=checkbox]").element as HTMLInputElement
		const identifiedInitialValue = checkbox.value

		expect(Number(identifiedInitialValue)).toEqual(Number(modelValue))
	})
})
