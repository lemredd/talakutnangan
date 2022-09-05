import { mount, flushPromises } from "@vue/test-utils"

import { JSON_API_MEDIA_TYPE } from "$/types/server"

import RequestEnvironment from "$/helpers/request_environment"
import RoleFactory from "~/factories/role"
import {
	tag,
	user,
	post,
	comment,
	semester,
	profanity,
	department,
	role
} from "$/permissions/permission_list"
import Page from "./read.page.vue"

describe("UI Page: Read resource by ID", () => {
	it("should uncheck dependent permissions", async() => {
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

		const wrapper = mount(Page, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"role": sampleResource
						}
					}
				}
			}
		})

		const createCommentPermission = wrapper.find(
			".comment-flags input[type=checked][value=create]"
		)
		const viewPostPermission = wrapper.find(".post-flags input[type=checked][value=view]")
		const viewCommentPermission = wrapper.find(".comment-flags input[type=checked][value=view]")

		await viewCommentPermission.setValue(false)

		const castViewPostPermissionCheckbox = viewPostPermission.element as HTMLInputElement
		const castCreateCommentPermissionCheckbox = createCommentPermission
		.element as HTMLInputElement
		expect(castViewPostPermissionCheckbox.checked).toBeTruthy()
		expect(castCreateCommentPermissionCheckbox.checked).toBeFalsy()
	})

	it.skip("can edit role name", async() => {
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
		.serializedOne(true)
		const newSampleModel = await new RoleFactory().makeOne()

		fetchMock.mockResponseOnce("{}", { "status": RequestEnvironment.status.NO_CONTENT })

		const wrapper = mount(Page, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"role": sampleResource
						}
					}
				}
			}
		})

		const roleName = wrapper.find(".role-name input")
		const submit = wrapper.find("[type='submit']")

		await roleName.setValue(newSampleModel.name)
		await submit.setValue("submit")
		await flushPromises()

		// TODO?: test update submission and expect new role name to successfully push in database
		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/user")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.json()).resolves.toStrictEqual({
			"data": {
				"attributes": {
					...sampleResource.data.attributes,
					"name": newSampleModel.name
				},
				"id": sampleResource.data.id,
				"type": "role"
			}
		})
	})

	it.todo("Should be archivable")
	it.todo("Should be restorable")
})
