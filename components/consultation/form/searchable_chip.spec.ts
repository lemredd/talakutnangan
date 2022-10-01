/* eslint-disable vue/sort-keys */
import { flushPromises, shallowMount } from "@vue/test-utils"

import "~/setups/database.setup"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import DepartmentFactory from "~/factories/department"

import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import { READ_OWN } from "$/permissions/user_combinations"
import { user as permissionGroup } from "$/permissions/permission_list"

import Component from "./searchable_chip.vue"
import RequestEnvironment from "$/singletons/request_environment"
import { DeserializedUserResource } from "$/types/documents/user"

describe("Component: Searchable Chip", () => {
	jest.useFakeTimers()

	it("should search and add users in a given kind", async() => {
		const department = await new DepartmentFactory().mayAdmit().insertOne()
		const role = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...READ_OWN))
		.insertOne()

		const users = await new UserFactory()
		.in(department)
		.attach(role)
		.deserializedMany(5, true)

		const wrapper = shallowMount(Component, {
			"props": {
				"header": "",
				"modelValue": [],
				"maximumParticipants": 1,
				"textFieldLabel": "",
				"kind": "student"
			}
		})
		const searchField = wrapper.findComponent({ "name": "NonSensitiveTextField" })

		fetchMock.mockResponseOnce(
			JSON.stringify(users),
			{ "status": RequestEnvironment.status.OK }
		)
		const [ userToSelect ] = users.data
		await searchField.setValue(userToSelect.name)
		jest.advanceTimersByTime(DEBOUNCED_WAIT_DURATION)
		await flushPromises()

		const [ chip ] = wrapper.findAll(".chip")
		await chip.trigger("click")
		await wrapper.setProps({
			"modelValue": [ userToSelect ]
		})

		const selectedParticipants = wrapper.find(".selectedParticipants")
		expect(selectedParticipants).toBeTruthy()
		expect(wrapper.emitted()).toHaveProperty("update:modelValue[0][0]", [ userToSelect ])
	})

	it("should not show user in candidates if already selected", async() => {
		const department = await new DepartmentFactory().mayAdmit().insertOne()
		const role = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...READ_OWN))
		.insertOne()

		const users = await new UserFactory()
		.in(department)
		.attach(role)
		.deserializedMany(5, true)

		const wrapper = shallowMount(Component, {
			"props": {
				"header": "",
				"modelValue": [],
				"maximumParticipants": 2,
				"textFieldLabel": "",
				"kind": "student"
			}
		})
		const searchField = wrapper.findComponent({ "name": "NonSensitiveTextField" })

		fetchMock.mockResponseOnce(
			JSON.stringify(users),
			{ "status": RequestEnvironment.status.OK }
		)
		const [ userToSelect ] = users.data
		await searchField.setValue(userToSelect.name)
		jest.advanceTimersByTime(DEBOUNCED_WAIT_DURATION)
		await flushPromises()

		const [ chip ] = wrapper.findAll(".chip")
		await chip.trigger("click")
		await wrapper.setProps({
			"modelValue": [ userToSelect ]
		})
		await searchField.setValue("")

		users.data.shift()
		fetchMock.mockResponseOnce(
			JSON.stringify(users),
			{ "status": RequestEnvironment.status.OK }
		)
		await searchField.setValue("")
		jest.advanceTimersByTime(DEBOUNCED_WAIT_DURATION)
		await flushPromises()

		const isSelectedUserPresentInCandidates = users.data.findIndex(
			(user: DeserializedUserResource) => userToSelect === user
		) === 1

		expect(isSelectedUserPresentInCandidates).toBeFalsy()
	})

	it("should remove selected participant", async() => {
		const department = await new DepartmentFactory().mayAdmit().insertOne()
		const role = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...READ_OWN))
		.insertOne()

		const users = await new UserFactory()
		.in(department)
		.attach(role)
		.deserializedMany(5, true)
		const [ userToSelect ] = users.data
		users.data.shift()

		const wrapper = shallowMount(Component, {
			"props": {
				"header": "",
				"modelValue": [ userToSelect ],
				"maximumParticipants": 1,
				"textFieldLabel": "",
				"kind": "student"
			}
		})
		const deselectUserBtn = wrapper.find("#close-btn")

		await deselectUserBtn.trigger("click")
		await wrapper.setProps({
			"modelValue": []
		})

		expect(wrapper.emitted()).toHaveProperty("update:modelValue[0][0]", [])
	})

	it("should not remove current user participant", async() => {
		const department = await new DepartmentFactory().mayAdmit().insertOne()
		const role = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...READ_OWN))
		.insertOne()

		const users = await new UserFactory()
		.in(department)
		.attach(role)
		.deserializedMany(5, true)
		const [ userToSelect ] = users.data
		users.data.shift()

		const wrapper = shallowMount(Component, {
			"props": {
				"header": "",
				"modelValue": [ userToSelect ],
				"maximumParticipants": 1,
				"textFieldLabel": "",
				"kind": "student"
			}
		})
		const deselectUserBtn = wrapper.find("#close-btn")

		await deselectUserBtn.trigger("click")
		await wrapper.setProps({
			"modelValue": []
		})

		expect(wrapper.emitted()).toHaveProperty("update:modelValue[0][0]", [])
	})
})
