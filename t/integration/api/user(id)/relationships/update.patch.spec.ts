import { MULTIPART_MEDIA_TYPE, JSON_API_MEDIA_TYPE } from "$/types/server"

import flushPromises from "flush-promises"
import "~/set-ups/email.set_up"

import App from "~/set-ups/app"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import RequestEnvironment from "$!/singletons/request_environment"

import Transport from "!/helpers/email/transport"
import { UPDATE_OWN_DATA } from "$/permissions/user_combinations"
import { user as permissionGroup } from "$/permissions/permission_list"

import Route from "!%/api/user(id)/relationships/signature/update.patch"

describe("PATCH /api/user/:id/relationships/signature/update", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can upload valid student details", async () => {
		jest.setTimeout(10000)

		const adminRole = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...UPDATE_OWN_DATA))
			.insertOne()
		const { user: admin, cookie } = await App.makeAuthenticatedCookie(adminRole, userFactory => {
			return userFactory.beStudent()
		})
		const path = `${RequestEnvironment.root}/t/data/logo_bg_transparent.png`

		const response = await App.request
			.post(`/api/user/${admin.id}/relationships/signature/update`)
			.field("data[type]", "signature")
			.attach("data[attributes][signature]", path)
			.set("Cookie", cookie)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body.data).toHaveLength(3)
		expect(response.body.included).toHaveLength(7)

		await flushPromises() // Policy middleware runs
		await flushPromises() // Middleware intermediate runs
		await flushPromises() // E-mail template read for first user
		await flushPromises() // E-mail template read for second user
		await flushPromises() // E-mail template read for third user
		await flushPromises() // E-mail message transmission to first user
		await flushPromises() // E-mail message transmission to second user
		await flushPromises() // E-mail message transmission to third user

		// Waiting for all transmissions to finish
		await new Promise(resolve => setTimeout(resolve, 1000))

		const previousMessages = Transport.consumePreviousMessages()
		expect(previousMessages).toHaveLength(3)
		expect(previousMessages[0]).toHaveProperty("message")
		expect(previousMessages[0]).toHaveProperty("message.subject", "New User in Talakutnangan")
		expect(previousMessages[0].message.text).toContain("Juan Dela Cruz")
		expect(previousMessages[0].message.text).toContain("j.delacruz20111@mcc.edu.ph")
		expect(previousMessages[0].message.text).toContain("student")
		expect(previousMessages[0].message.text).toContain("1920-111")
		expect(previousMessages[1]).toHaveProperty("message.subject", "New User in Talakutnangan")
		expect(previousMessages[1].message.text).toContain("Alice Garcia")
		expect(previousMessages[1].message.text).toContain("a.garcia20112@mcc.edu.ph")
		expect(previousMessages[1].message.text).toContain("student")
		expect(previousMessages[1].message.text).toContain("1920-112")
		expect(previousMessages[2]).toHaveProperty("message.subject", "New User in Talakutnangan")
		expect(previousMessages[2].message.text).toContain("Bob Marquis")
		expect(previousMessages[2].message.text).toContain("n.marquis20113@mcc.edu.ph")
		expect(previousMessages[2].message.text).toContain("student")
		expect(previousMessages[2].message.text).toContain("1920-113")
	})
})
