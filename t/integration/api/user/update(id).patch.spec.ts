import flushPromises from "flush-promises"
import { JSON_API_MEDIA_TYPE } from "$/types/server"
import RequestEnvironment from "$!/singletons/request_environment"

import { USER_LINK } from "$/constants/template_links"

import "~/setups/email.setup"
import App from "~/setups/app"
import UserFactory from "~/factories/user"
import RoleFactory from "~/factories/role"
import specializePath from "$/helpers/specialize_path"

import User from "%/models/user"
import Transport from "!/singletons/transport"
import { UPDATE_OWN_DATA } from "$/permissions/user_combinations"
import { user as permissionGroup } from "$/permissions/permission_list"
import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"

import Route from "!%/api/user/update(id).patch"

describe("PATCH /api/user/:id", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by student and update own e-mail", async() => {
		const studentRole = await new RoleFactory()
		.userFlags(permissionGroup.generateFlags(...UPDATE_OWN_DATA))
		.insertOne()

		const { "user": student, cookie } = await App.makeAuthenticatedCookie(studentRole)
		const newStudent = await new UserFactory().email(() => "example.1@example.com").makeOne()

		const response = await App.request
		.patch(specializePath(USER_LINK.bound, {
			"id": student.id
		}))
		.set("Cookie", cookie)
		.send({
			"data": {
				"attributes": {
					"email": newStudent.email,
					"name": student.name,
					"prefersDark": newStudent.prefersDark
				},
				"id": String(student.id),
				"type": "user"
			}
		})
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)

		const updatedStudent = await User.findOne({ "where": { "id": student.id } })
		expect(updatedStudent?.emailVerifiedAt).toBeNull()

		// Middleware intermediate runs
		await flushPromises()
		// Intermediate promise
		await flushPromises()
		// Make temporary URL
		await flushPromises()
		// Make encrypted URL
		await flushPromises()
		// Make encrypted path
		await flushPromises()
		// Encrypt
		await flushPromises()
		// Import `crypto` module
		await flushPromises()
		// Generate key
		await flushPromises()
		// E-mail template read
		await flushPromises()
		// E-mail message transmission
		await flushPromises()
		// Wait for complete transmission
		await new Promise(resolve => {
			setTimeout(resolve, convertTimeToMilliseconds("00:00:01"))
		})
		const previousMessages = Transport.consumePreviousMessages()
		expect(previousMessages).toHaveLength(1)
		expect(previousMessages[0]).toHaveProperty("message")
		expect(previousMessages[0]).toHaveProperty("message.subject", "Email Verification")
		expect(previousMessages[0].message.text).toContain(updatedStudent?.email)
		expect(previousMessages[0].message.text).toContain("/user/verify")
	}, convertTimeToMilliseconds("00:00:10"))

	it("can be accessed by student and retain email verification after update", async() => {
		const studentRole = await new RoleFactory()
		.userFlags(permissionGroup.generateFlags(...UPDATE_OWN_DATA))
		.insertOne()

		const { "user": student, cookie } = await App.makeAuthenticatedCookie(
			studentRole,
			userFactory => userFactory.email(() => "example.2@example.com")
		)
		const newStudent = await new UserFactory()
		.prefersDark(() => true)
		.makeOne()

		const response = await App.request
		.patch(specializePath(USER_LINK.bound, {
			"id": student.id
		}))
		.set("Cookie", cookie)
		.send({
			"data": {
				"attributes": {
					"email": student.email,
					"name": newStudent.name,
					"prefersDark": newStudent.prefersDark
				},
				"id": String(student.id),
				"type": "user"
			}
		})
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)

		const updatedStudent = await User.findOne({ "where": { "id": student.id } })
		expect(updatedStudent?.emailVerifiedAt).toStrictEqual(student.emailVerifiedAt)
		expect(updatedStudent?.name).toBe(newStudent.name)
		expect(updatedStudent?.prefersDark).toBe(newStudent.prefersDark)
	})
})
