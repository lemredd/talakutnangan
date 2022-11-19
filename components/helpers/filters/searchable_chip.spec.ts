import { shallowMount } from "@vue/test-utils"

import type { ChipData } from "$@/types/component"

import Component from "./searchable_chip.vue"

describe("Component: helpers/filters/searchable_chip", () => {
	it("should add chips", async() => {
		const id = "1"
		const selectedChips: ChipData[] = []
		const unselectedChips: ChipData[] = [
			{
				"data": "A",
				id,
				"mayRemove": true
			}
		]

		const wrapper = shallowMount(Component, {
			"global": {
				"stubs": {
					"Suspensible": false
				}
			},
			"props": {
				"header": "",
				"isLoaded": true,
				"maximumChips": 1,
				"modelValue": "",
				selectedChips,
				"textFieldLabel": "",
				unselectedChips
			}
		})

		const [ chip ] = wrapper.findAll(".chip.unselected")
		await chip.trigger("click")

		expect(wrapper.emitted()).toHaveProperty("addChip.0.0", id)
	})

	it("should remove chips", async() => {
		const id = "1"
		const selectedChips: ChipData[] = [
			{
				"data": "A",
				id,
				"mayRemove": true
			}
		]
		const unselectedChips: ChipData[] = []

		const wrapper = shallowMount(Component, {
			"global": {
				"stubs": {
					"Suspensible": false
				}
			},
			"props": {
				"header": "",
				"isLoaded": true,
				"maximumChips": 1,
				"modelValue": "",
				selectedChips,
				"textFieldLabel": "",
				unselectedChips
			}
		})

		const [ chip ] = wrapper.findAll(".chip.selected")
		await chip.find(".material-icons").trigger("click")

		expect(wrapper.emitted()).toHaveProperty("removeChip.0.0", id)
	})

	it("may not remove chips", () => {
		const id = "1"
		const selectedChips: ChipData[] = [
			{
				"data": "A",
				id,
				"mayRemove": false
			}
		]
		const unselectedChips: ChipData[] = []

		const wrapper = shallowMount(Component, {
			"global": {
				"stubs": {
					"Suspensible": false
				}
			},
			"props": {
				"header": "",
				"isLoaded": true,
				"maximumChips": 1,
				"modelValue": "",
				selectedChips,
				"textFieldLabel": "",
				unselectedChips
			}
		})

		const [ chip ] = wrapper.findAll(".chip.selected")

		expect(chip.find(".material-icons").exists()).toBeFalsy()
	})

	it("should update slug", async() => {
		const selectedChips: ChipData[] = []
		const unselectedChips: ChipData[] = []

		const wrapper = shallowMount(Component, {
			"global": {
				"stubs": {
					"Suspensible": false
				}
			},
			"props": {
				"header": "",
				"isLoaded": true,
				"maximumChips": 1,
				"modelValue": "",
				selectedChips,
				"textFieldLabel": "",
				unselectedChips
			}
		})

		const slugValue = "Hello"
		const slug = wrapper.findComponent({ "name": "NonSensitiveTextField" })
		await slug.setValue(slugValue)

		expect(wrapper.emitted()).toHaveProperty("update:modelValue.0.0", slugValue)
	})
})
