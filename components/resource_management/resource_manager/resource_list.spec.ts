import { CommonQueryParameters } from "$/types/query"

import { mount } from "@vue/test-utils"

import ResourceList from "./resource_list.vue"
import RequestEnvironment from "$/helpers/request_environment"
import UserFetcher from "$@/communicators/user"
import { deserialise } from "kitsu-core"
import Manager from "../manager"

describe("Component: Resource List", () => {
	describe("User List", () => {
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

		it("Should list users properly", async () => {
			const sampleUserList = await listUsers()

			console.log(sampleUserList)

			const wrapper = mount(ResourceList, {
				global: {
					provide: {
						managerKind: new Manager("dean")
					}
				},
				props: {
					searchFilter: "",
					filteredList: sampleUserList
				}
			})

			console.log("wrapper", wrapper.html())
		})
	})
})
