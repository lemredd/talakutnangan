import { shallowMount } from "@vue/test-utils"

import specializePath from "$/helpers/specialize_path"

import Component from "./resource_list.vue"

describe("Component: Resource List", () => {
	it("should have a read link", () => {
		const templatePath = "a/read/:id"
		const wrapper = shallowMount(Component, {
			"props": {
				"headers": [ "Name" ],
				"list": [
					{
						"data": [ "Hello" ],
						"id": "1"
					}
				],
				"mayArchive": false,
				"mayEdit": true,
				"mayRestore": false,
				"selectedIDs": [],
				templatePath
			}
		})
		const readResourceBtn = wrapper.findAll(".read-resource-btn")

		readResourceBtn.forEach(
			(btn, index) => expect(btn.attributes("href")).toEqual(specializePath(templatePath, {
				"id": index + 1
			}))
		)
	})

	it("should have no read link", () => {
		const wrapper = shallowMount(Component, {
			"props": {
				"headers": [ "Name" ],
				"list": [
					{
						"data": [ "Hello" ],
						"id": "1"
					}
				],
				"mayArchive": false,
				"mayEdit": true,
				"mayRestore": false,
				"selectedIDs": []
			}
		})

		const readResourceBtn = wrapper.find(".read-resource-btn")

		expect(readResourceBtn.exists()).toBeFalsy()
	})

	it("should have no list", () => {
		const wrapper = shallowMount(Component, {
			"props": {
				"headers": [ "Name" ],
				"list": [],
				"mayArchive": false,
				"mayEdit": false,
				"mayRestore": false,
				"selectedIDs": []
			}
		})

		const message = wrapper.find(".no-results")

		expect(message.exists()).toBeTruthy()
	})
})
