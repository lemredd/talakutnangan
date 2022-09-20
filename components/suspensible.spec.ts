import { mount } from "@vue/test-utils"

import "~/setups/database.setup"
import RoleFetcher from "$@/fetchers/role"
import RoleFactory from "~/factories/role"
import Suspensible from "./suspensible.vue"
import RequestEnvironment from "$/singletons/request_environment"
import { user as permissionGroup } from "$/permissions/permission_list"
import { READ_ANYONE_ON_OWN_DEPARTMENT } from "$/permissions/user_combinations"

describe("UI Component: Suspensible", () => {
	it("Should load asynchronous resource", async() => {
		const sampleResource = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_OWN_DEPARTMENT))
			.serializedOne()

		fetchMock.mockResponseOnce(JSON.stringify({
			"data": sampleResource
		}), { "status": RequestEnvironment.status.OK })

		const fetcher = new RoleFetcher()
		const response = await fetcher.read(sampleResource.data.id)

		const wrapper = mount(Suspensible, {
			"props": {
				"isLoaded": response.body.data !== null
			}
		})

		const loaded = wrapper.find(".loaded")
		expect(wrapper.html()).toContain(loaded.html())
	})

	it.todo("Should fall back if resource is not fully loaded"/* , async () => {
		const sampleResource = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_OWN_DEPARTMENT))
		.serializedOne()

		fetchMock.mockResponseOnce(JSON.stringify({
			data: sampleResource
		}), { status: RequestEnvironment.status.OK })

		const fetcher = new RoleFetcher()
		const response = await fetcher.read(sampleResource.data.id)

		const wrapper = mount(Suspensible, {
			props: {
				asyncResource: response.body.data
			}
		})

		const loading = wrapper.find(".loading")
		expect(wrapper.html()).toContain(loading.html())
	} */)
})
