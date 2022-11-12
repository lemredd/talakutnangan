import { shallowMount } from "@vue/test-utils"

import Component from "./page_counter.vue"

describe("Component: page counter", () => {
	it("can generate page count buttons by balanced count", () => {
		const wrapper = shallowMount(Component, {
			"props": {
				"maxCount": 50
			}
		})

		const pageCountBtns = wrapper.findAll(".page-count-btn")
		const expectedLength = 5
		expect(pageCountBtns.length).toEqual(expectedLength)
	})

	it("can generate page count buttons by imbalance count", () => {
		const wrapper = shallowMount(Component, {
			"props": {
				"maxCount": 48
			}
		})

		const pageCountBtns = wrapper.findAll(".page-count-btn")
		const expectedLength = 5
		expect(pageCountBtns.length).toEqual(expectedLength)
	})
})
