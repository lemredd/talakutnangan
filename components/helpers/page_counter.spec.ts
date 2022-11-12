import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"
import { shallowMount } from "@vue/test-utils"

import Component from "./page_counter.vue"

describe("Component: page counter", () => {
	it("can generate page count buttons by balanced count", () => {
		const wrapper = shallowMount(Component, {
			"props": {
				"maxCount": 50,
				"modelValue": 0
			}
		})

		const pageCountBtns = wrapper.findAll(".page-count-btn")
		const expectedLength = 5
		expect(pageCountBtns.length).toEqual(expectedLength)
	})

	it("can generate page count buttons by imbalance count", () => {
		const wrapper = shallowMount(Component, {
			"props": {
				"maxCount": 48,
				"modelValue": 0
			}
		})

		const pageCountBtns = wrapper.findAll(".page-count-btn")
		const expectedLength = 5
		expect(pageCountBtns.length).toEqual(expectedLength)
	})

	it("can emit custon events", () => {
		const wrapper = shallowMount(Component, {
			"props": {
				"maxCount": 50,
				"modelValue": 0
			}
		})

		const pageBtns = wrapper.findAll(".page-count-btn")
		pageBtns.forEach(async btn => await btn.trigger("click"))

		const emissions = wrapper.emitted()
		const expectedProperty = "update:modelValue"
		const EXPECTED_PROPERTY_LENGTH = pageBtns.length
		expect(emissions).toHaveProperty(expectedProperty)
		expect(emissions[expectedProperty]).toHaveLength(EXPECTED_PROPERTY_LENGTH)
		emissions[expectedProperty].forEach((event: any, index) => {
			const offset = index * DEFAULT_LIST_LIMIT
			const [ emittedValue ] = event
			expect(emittedValue).toEqual(offset)
		})
	})
})
