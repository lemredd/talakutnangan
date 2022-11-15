import { shallowMount } from "@vue/test-utils"

import specializePath from "$/helpers/specialize_path"

import Component from "./resource_list.vue"

describe("Component: Resource List", () => {
	it("should have a read link", () => {
		const templatePath = "a/read/:id"
		const wrapper = shallowMount(Component, {
			"global": {
				"stubs": {
					"ResourceTable": false
				}
			},
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
		const readResourceButtons = wrapper.findAll(".read-resource-btn")

		readResourceButtons.forEach(
			(btn, index) => expect(btn.attributes("href")).toEqual(specializePath(templatePath, {
				"id": index + 1
			}))
		)
	})

	it("should have no read link", () => {
		const wrapper = shallowMount(Component, {
			"global": {
				"stubs": {
					"ResourceTable": false
				}
			},
			"props": {
				"headers": [ "Name" ],
				"list": [
					{
						"data": [ "Hello" ],
						"id": "1"
					}
				],
				"mayArchive": false,
				"mayEdit": false,
				"mayRestore": false,
				"selectedIDs": []
			}
		})

		const readResourceButton = wrapper.find(".read-resource-btn")
		const selectResourceButton = wrapper.find(".select-resource-btn")

		expect(readResourceButton.exists()).toBeFalsy()
		expect(selectResourceButton.exists()).toBeFalsy()
	})

	it("should have no list", () => {
		const wrapper = shallowMount(Component, {
			"global": {
				"stubs": {
					"ResourceTable": false
				}
			},
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

	it("should be archivable", async() => {
		const id = "1"
		const wrapper = shallowMount(Component, {
			"global": {
				"stubs": {
					"ResourceTable": false
				}
			},
			"props": {
				"headers": [ "Name" ],
				"list": [
					{
						"data": [ "Hello" ],
						id
					}
				],
				"mayArchive": true,
				"mayEdit": false,
				"mayRestore": false,
				"selectedIDs": []
			}
		})
		const selectResourceButton = wrapper.find(".select-resource-btn")
		const archiveResourceButton = wrapper.find(".archive-resource-btn")
		await archiveResourceButton.trigger("click")

		expect(selectResourceButton.exists()).toBeTruthy()
		const emitted = wrapper.emitted()
		expect(emitted).toHaveProperty("archive.0.0", id)
	})

	it("should be restorable", async() => {
		const id = "1"
		const wrapper = shallowMount(Component, {
			"global": {
				"stubs": {
					"ResourceTable": false
				}
			},
			"props": {
				"headers": [ "Name" ],
				"list": [
					{
						"data": [ "Hello" ],
						id
					}
				],
				"mayArchive": false,
				"mayEdit": false,
				"mayRestore": true,
				"selectedIDs": []
			}
		})
		console.log(wrapper.html(), "\n\n\n")
		const selectResourceButton = wrapper.find(".select-resource-btn")
		const restoreResourceButton = wrapper.find(".restore-resource-btn")
		await restoreResourceButton.trigger("click")

		expect(selectResourceButton.exists()).toBeTruthy()
		const emitted = wrapper.emitted()
		expect(emitted).toHaveProperty("restore.0.0", id)
	})
})
