import { mount, flushPromises } from "@vue/test-utils"
import RoleFactory from "~/factories/role"
import {
	tag,
	user,
	post,
	comment,
	semester,
	profanity,
	auditTrail,
	department,
	role
} from "$/permissions/permission_list"
import { UPDATE_ANYONE_ON_ALL_DEPARTMENTS } from "$/permissions/user_combinations"
import Page from "./id.page.vue"
import RoleFetcher from "$@/fetchers/role"
import RequestEnvironment from "$/helpers/request_environment"

describe("UI Page: Read resource by ID", () => {
	it("Should load resource by ID", async () => {
		const sampleResource = await new RoleFactory()
		.departmentFlags(department.generateMask("view"))
					.roleFlags(role.generateMask("view"))
					.semesterFlags(semester.generateMask("view"))
					.tagFlags(tag.generateMask("view", "create", "update", "archiveAndRestore"))
					.postFlags(post.generateMask(
						"view",
						"create",
						"update",
						"archiveAndRestore",
						"readDepartmentScope",
						"writeDepartmentScope",
						"tag"
					))
					.commentFlags(comment.generateMask(
						"view",
						"create",
						"update",
						"archiveAndRestore",
						"readDepartmentScope",
						"writeDepartmentScope",
						"vote"
					))
					.profanityFlags(profanity.generateMask("view", "readOverallScope"))
					.userFlags(user.generateMask(
						"view",
						"create",
						"update",
						"archiveAndRestore",
						"readDepartmentScope",
						"writeDepartmentScope"
					))
					.auditTrailFlags(0)
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

		await flushPromises()

		const fetchedRoleName = wrapper.find(".role-name h1")
		const expectedRoleName = response.body.data.name
		expect(fetchedRoleName.html()).toContain(expectedRoleName)
	})
})
