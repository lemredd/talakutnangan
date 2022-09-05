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
	it("render properly", async() => {
		const sampleResource = await new RoleFactory()
		.departmentFlags(department.generateMask("view"))
		.roleFlags(role.generateMask("view"))
		.semesterFlags(semester.generateMask("view"))
		.tagFlags(tag.generateMask("view"))
		.postFlags(post.generateMask("view"))
		.commentFlags(comment.generateMask("view"))
		.profanityFlags(profanity.generateMask("view"))
		.userFlags(user.generateMask("view"))
		.auditTrailFlags(0)
		.deserializedOne()

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

		const viewCheckboxes = wrapper.findAll("input[type=checkbox][value=view]")

		const checkedValues = viewCheckboxes.map(checkbox => {
			const castCheckbox = checkbox.element as HTMLInputElement
			return castCheckbox.checked
		})

		expect(checkedValues).toEqual([
			// Semester Flags
			true,
			// Tag Flags
			true,
			// Post Flags
			true,
			// Comment Flags
			true,
			// Profanity Flags
			true,
			// User Flags
			true,
			// Audit Trail Flags
			false
		])
	})

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
		.deserializedOne()

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
			"#comment-flags input[type=checkbox][value=create]"
		)
		const viewPostPermission = wrapper.find("#post-flags input[type=checkbox][value=view]")
		const viewCommentPermission = wrapper.find("#comment-flags input[type=checkbox][value=view]")

		await viewCommentPermission.setValue(false)

		const castViewPostPermissionCheckbox = viewPostPermission.element as HTMLInputElement
		const castCreateCommentPermissionCheckbox = createCommentPermission
		.element as HTMLInputElement
		expect(castViewPostPermissionCheckbox.checked).toBeTruthy()
		expect(castCreateCommentPermissionCheckbox.checked).toBeFalsy()
	})

	it("can edit role name", async() => {
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
		.deserializedOne(true)
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

		const roleName = wrapper.find("input[type='text']")
		const editButton = wrapper.find("input[type='text'] + button")
		const submit = wrapper.find("[type='submit']")

		await editButton.trigger("click")
		await roleName.setValue(newSampleModel.name)
		await submit.trigger("submit")
		await flushPromises()

		// TODO?: test update submission and expect new role name to successfully push in database
		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "PATCH")
		expect(request).toHaveProperty("url", `/api/role/${sampleResource.data.id}`)
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		const requestBody = await request.json()
		const { type, id, ...attributes } = sampleResource.data
		expect(requestBody).toStrictEqual({
			"data": {
				"attributes": {
					...attributes,
					"deletedAt": null,
					"name": newSampleModel.name
				},
				id,
				type
			}
		})
	})

	it.todo("Should be archivable")
	it.todo("Should be restorable")
})
