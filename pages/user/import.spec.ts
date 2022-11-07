import { nextTick } from "vue"
import { mount, flushPromises } from "@vue/test-utils"

import { DeserializedRoleListDocument } from "$/types/documents/role"

import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import deserialize from "$/object/deserialize"
import StudentDetailFactory from "~/factories/student_detail"
import RequestEnvironment from "$/singletons/request_environment"

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
		const serializedUsers = await new UserFactory().serialize(users)
		const deserializedRoles = deserialize(
			await new RoleFactory().serialize(rawRoles)
		) as DeserializedRoleListDocument
		deserializedRoles.meta = {
			"count": 0
		}

		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": [],
				"meta": {
					"count": 0
				}
			}),
			{ "status": RequestEnvironment.status.OK }
		)
		fetchMock.mockResponseOnce(
			JSON.stringify(serializedUsers),
			{ "status": RequestEnvironment.status.CREATED }
		)

		global.FormData = jest.fn()

		const wrapper = mount(Component, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"roles": deserializedRoles
						}
					}
				}
			}
		})

		await flushPromises()
		const submitButton = wrapper.find("input[type=submit]")
		await submitButton.trigger("submit")
		await flushPromises()

		const castFetch = fetch as jest.Mock<any, any>
		expect(castFetch).toHaveBeenCalledTimes(2)
		const [ [ unusedFirstRequest ], [ secondRequest ] ] = castFetch.mock.calls
		expect(secondRequest).toHaveProperty("method", "POST")
		expect(secondRequest).toHaveProperty("url", "/api/user/import")
		const output = wrapper.find("output")
		expect(output.findAll("th")).toHaveLength(NUMBER_OF_EXPECTED_COLUMNS)
		expect(output.findAll("td")).toHaveLength(NUMBER_OF_EXPECTED_COLUMNS * NUMBER_OF_USERS)
	})

	it.skip("can render created students properly", async() => {
		const NUMBER_OF_USERS = 2
		const unusedNUMBER_OF_EXPECTED_COLUMNS = 3
		const rawRoles = await new RoleFactory().insertMany(2)
		const rawUsers = await new UserFactory()
		.attach(rawRoles[0])
		.attach(rawRoles[1])
		.beReachableEmployee()
		.insertMany(NUMBER_OF_USERS)

		const serializedUsers = await new UserFactory().serialize(rawUsers)
		const deserializedRoles = deserialize(await new RoleFactory().serialize(rawRoles))

		fetchMock.mockResponse(
			JSON.stringify(serializedUsers),
			{ "status": RequestEnvironment.status.CREATED }
		)

		global.FormData = jest.fn()

		const wrapper = mount(Component, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"roles": deserializedRoles
						}
					}
				},
				"stubs": {
					"OutputTable": false
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
	})
})
