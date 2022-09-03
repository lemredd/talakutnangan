import { shallowMount, flushPromises } from "@vue/test-utils"

import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import deserialize from "$/helpers/deserialize"
import RoleTransformer from "%/transformers/role"
import UserTransformer from "%/transformers/user"
import Serializer from "%/transformers/serializer"
import StudentDetailFactory from "~/factories/student_detail"
import RequestEnvironment from "$/helpers/request_environment"

import Component from "./import.page.vue"

describe("Page: user/import", () => {
	it("can render created students properly", async() => {
		const NUMBER_OF_USERS = 3
		const NUMBER_OF_EXPECTED_COLUMNS = 4
		const rawRoles = await new RoleFactory().insertMany(2)
		const rawUsers = await new UserFactory()
		.beStudent()
		.attach(rawRoles[0])
		.attach(rawRoles[1])
		.insertMany(NUMBER_OF_USERS)

		const users = await Promise.all(rawUsers.map(async user => {
			user.studentDetail = await new StudentDetailFactory()
			.user(() => Promise.resolve(user))
			.insertOne()

			return user
		}))

		const serializedUsers = Serializer.serialize(users, new UserTransformer(), {})
		const deserializedRoles = deserialize(Serializer.serialize(
			rawRoles,
			new RoleTransformer(),
			{}
		))

		fetchMock.mockResponse(
			JSON.stringify(serializedUsers),
			{ "status": RequestEnvironment.status.CREATED }
		)

		global.FormData = jest.fn()

		const wrapper = shallowMount(Component, {
			"global": {
				"stubs": {
					"OutputTable": false
				},
				"provide": {
					"pageContext": {
						"pageProps": {
							"roles": deserializedRoles
						}
					}
				}
			}
		})

		const submitButton = wrapper.find("input[type=submit]")
		await submitButton.trigger("submit")
		await flushPromises()
		await flushPromises()

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/user/import")
		const output = wrapper.find("output")
		expect(output.exists()).toBeTruthy()
		expect(output.findAll("th")).toHaveLength(NUMBER_OF_EXPECTED_COLUMNS)
		expect(output.findAll("td")).toHaveLength(NUMBER_OF_EXPECTED_COLUMNS * NUMBER_OF_USERS)
	})

	it("can render created students properly", async() => {
		const NUMBER_OF_USERS = 2
		const NUMBER_OF_EXPECTED_COLUMNS = 3
		const rawRoles = await new RoleFactory().insertMany(2)
		const rawUsers = await new UserFactory()
		.attach(rawRoles[0])
		.attach(rawRoles[1])
		.beReachableEmployee()
		.insertMany(NUMBER_OF_USERS)

		const serializedUsers = Serializer.serialize(rawUsers, new UserTransformer(), {})
		const deserializedRoles = deserialize(Serializer.serialize(
			rawRoles,
			new RoleTransformer(),
			{}
		))

		fetchMock.mockResponse(
			JSON.stringify(serializedUsers),
			{ "status": RequestEnvironment.status.CREATED }
		)

		global.FormData = jest.fn()

		const wrapper = shallowMount(Component, {
			"global": {
				"stubs": {
					"OutputTable": false
				},
				"provide": {
					"pageContext": {
						"pageProps": {
							"roles": deserializedRoles
						}
					}
				}
			}
		})

		const submitButton = wrapper.find("input[type=submit]")
		await submitButton.trigger("submit")
		await flushPromises()
		await flushPromises()

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/user/import")
		const output = wrapper.find("output")
		expect(output.exists()).toBeTruthy()
		// expect(output.findAll("th")).toHaveLength(NUMBER_OF_EXPECTED_COLUMNS)
		// expect(output.findAll("td")).toHaveLength(NUMBER_OF_EXPECTED_COLUMNS * NUMBER_OF_USERS)
	})
})
