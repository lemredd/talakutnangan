import { mount, flushPromises } from "@vue/test-utils"
import RoleFactory from "~/factories/role"
import { user as permissionGroup } from "$/permissions/permission_list"
import { READ_ANYONE_ON_OWN_DEPARTMENT } from "$/permissions/user_combinations"
import Page from "./id.page.vue"
import RoleFetcher from "$@/fetchers/role"
import RequestEnvironment from "$/helpers/request_environment"

describe("UI Page: Read resource by ID", () => {
	it("Should load resource by ID", async () => {
		const sampleResource = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_OWN_DEPARTMENT))
		.serializedOne()

		fetchMock.mockResponse(JSON.stringify(sampleResource), { status: RequestEnvironment.status.OK })

		const fetcher = new RoleFetcher()
		const response = await fetcher.read(sampleResource.data.id)

		const wrapper = mount(Page, {
			global: {
				provide: {
					pageContext: {
						routeParams: {
							id: 0
						}
					}
				}
			}
		})

		console.log(response.body.data,"\n\n\n\n")
		console.log(wrapper.html(),"\n\n\n\n")
	})
})
