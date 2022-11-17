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

	it("may not remove chips", async() => {
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
})
