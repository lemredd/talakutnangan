import { flushPromises, shallowMount } from "@vue/test-utils"

import type { DeserializedUserResource } from "$/types/documents/user"

import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import { READ_OWN } from "$/permissions/user_combinations"
import RequestEnvironment from "$/singletons/request_environment"
import { user as permissionGroup } from "$/permissions/permission_list"

import Component from "./searchable_chip.vue"

describe("Component: Searchable Chip", () => {
	jest.useFakeTimers()

	it("should search and add users in a given kind", async() => {
		const currentUser = {
			"id": "1",
			"name": "A B"
		} as DeserializedUserResource
		const otherUser = {
			"id": "2",
			"name": "C D"
		} as DeserializedUserResource
		const wrapper = shallowMount(Component, {
			"props": {
				currentUser,
				"header": "",
				"kind": "student",
				"maximumParticipants": 1,
				"modelValue": [],
				"textFieldLabel": ""
			}
		})

		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": [
					otherUser
				]
			}),
			{ "status": RequestEnvironment.status.OK }
		)
		const searchableChip = wrapper.findComponent({ "name": "SearchableChip" })
		await searchableChip.vm.$emit("update:modelValue", otherUser.name)
		jest.advanceTimersByTime(DEBOUNCED_WAIT_DURATION)
		await flushPromises()
		await searchableChip.vm.$emit("addChip", otherUser.id)

		const castFetch = fetch as jest.Mock<any, any>
		expect(castFetch).toHaveBeenCalledTimes(1)
		expect(wrapper.emitted()).toHaveProperty("update:modelValue.0.0", [ otherUser ])
	})

	it("should not show user in candidates if already selected", async() => {
		const currentUser = {
			"id": "1",
			"name": "A B"
		} as DeserializedUserResource
		const otherUser = {
			"id": "2",
			"name": "C D"
		} as DeserializedUserResource
		const wrapper = shallowMount(Component, {
			"props": {
				currentUser,
				"header": "",
				"kind": "student",
				"maximumParticipants": 1,
				"modelValue": [
					currentUser,
					otherUser
				],
				"textFieldLabel": ""
			}
		})

		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": [
					otherUser
				]
			}),
			{ "status": RequestEnvironment.status.OK }
		)
		const searchableChip = wrapper.findComponent({ "name": "SearchableChip" })
		await searchableChip.vm.$emit("update:modelValue", otherUser.name)
		jest.advanceTimersByTime(DEBOUNCED_WAIT_DURATION)
		await flushPromises()
		await searchableChip.vm.$emit("addChip", otherUser.id)

		const castFetch = fetch as jest.Mock<any, any>
		expect(castFetch).toHaveBeenCalledTimes(1)
		expect(searchableChip.props("unselectedChips")).toStrictEqual([])
	})

	it("should remove selected participant", async() => {
		const currentUser = {
			"id": "1",
			"name": "A B"
		} as DeserializedUserResource
		const otherUser = {
			"id": "2",
			"name": "C D"
		} as DeserializedUserResource
		const wrapper = shallowMount(Component, {
			"props": {
				currentUser,
				"header": "",
				"kind": "student",
				"maximumParticipants": 1,
				"modelValue": [
					currentUser,
					otherUser
				],
				"textFieldLabel": ""
			}
		})

		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": [
					otherUser
				]
			}),
			{ "status": RequestEnvironment.status.OK }
		)
		const searchableChip = wrapper.findComponent({ "name": "SearchableChip" })
		await searchableChip.vm.$emit("update:modelValue", otherUser.name)
		jest.advanceTimersByTime(DEBOUNCED_WAIT_DURATION)
		await flushPromises()
		await searchableChip.vm.$emit("removeChip", otherUser.id)

		const castFetch = fetch as jest.Mock<any, any>
		expect(castFetch).toHaveBeenCalledTimes(1)
		expect(wrapper.emitted()).toHaveProperty("update:modelValue.0.0", [ currentUser ])
	})
})
