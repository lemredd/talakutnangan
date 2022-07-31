import type { CommonQueryParameters } from "$/types/query"

import { mount } from "@vue/test-utils"

import RequestEnvironment from "$/helpers/request_environment"
import UserFetcher from "$@/fetchers/user"
import { deserialise } from "kitsu-core"
import ResourceManager from "./resource_manager.vue"

describe("UI Component: Resource Manager", () => {
	describe("User Management", () => {
		async function listUsers() {
			fetchMock.mockResponseOnce(JSON.stringify({
				data: [
					{ type: "user", name: "KID A" }
				]
			}),
			{ status: RequestEnvironment.status.OK })

			UserFetcher.initialize("/api")
			const queryObject: CommonQueryParameters = {
				filter: {
					existence: "exists"
				},
				sort: [ "id", "name" ],
				page: {
					offset: 0,
					limit: 5
				}
			}
			const response = await UserFetcher.list(queryObject)

			return deserialise(response.body).data
		}

		it("Should identify if resource type is of user profile", async () => {
			const sampleUserList = await listUsers()

			const wrapper = mount(ResourceManager, {
				shallow: true,
				props: {
					resource: sampleUserList
				},
				global: {
					provide: {
						managerKind: "admin"
					}
				}
			})

			const filters = wrapper.find(".filters")
			expect(filters.exists()).toBeTruthy()
		})
	})

})
