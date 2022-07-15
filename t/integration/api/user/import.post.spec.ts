import flushPromises from "flush-promises"
import { JSON_API_MEDIA_TYPE } from "!/types/independent"

import RequestEnvironment from "$!/singletons/request_environment"

import "~/set-ups/email.set_up"
import App from "~/set-ups/app"
import RoleFactory from "~/factories/role"
import DepartmentFactory from "~/factories/department"

import Transport from "!/helpers/email/transport"
import Route from "!/app/routes/api/user/import.post"
import { IMPORT_USERS } from "$/permissions/user_combinations"
import { user as permissionGroup } from "$/permissions/permission_list"

describe.skip("POST /api/user/import", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can upload valid student details", async () => {
		const adminRole = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...IMPORT_USERS))
			.insertOne()
		const sampleRole = await (new RoleFactory()).insertOne()
		const IBCE = await (new DepartmentFactory().name(() => "I B C E")).insertOne()
		const IASTE = await (new DepartmentFactory().name(() => "I A S T E")).insertOne()
		const IHTM = await (new DepartmentFactory().name(() => "I H T M")).insertOne()
		const { user: admin, cookie } = await App.makeAuthenticatedCookie(adminRole)
		const path = `${RequestEnvironment.root}/t/data/valid_student_details.csv`

		const response = await App.request
			.post("/api/user/import")
			.field("kind", "student")
			.field("roles[]", [ sampleRole.name ])
			.attach("importedCSV", path)
			.set("Cookie", cookie)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body.data).toHaveLength(3)
		expect(response.body.included).toHaveLength(4)

		await flushPromises() // Policy middleware runs
		await flushPromises() // Middleware intermediate runs
		await flushPromises() // E-mail template read for first user
		await flushPromises() // E-mail template read for second user
		await flushPromises() // E-mail template read for third user
		await flushPromises() // E-mail message transmission to first user
		await flushPromises() // E-mail message transmission to second user
		await flushPromises() // E-mail message transmission to third user
		await flushPromises() // Waiting for all transmissions to finish

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

	it("cannot upload by text field", async () => {
		const adminRole = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...IMPORT_USERS))
			.insertOne()
		const role = await (new RoleFactory()).insertOne()
		const IBCE = await (new DepartmentFactory().name(() => "I B C E")).insertOne()
		const IASTE = await (new DepartmentFactory().name(() => "I A S T E")).insertOne()
		const IHTM = await (new DepartmentFactory().name(() => "I H T M")).insertOne()
		const { user: admin, cookie } = await App.makeAuthenticatedCookie(adminRole)
		const path = `${RequestEnvironment.root}/t/data/valid_student_details.csv`

		// TODO: Output the validation error in better format
		const response = await App.request
			.post("/api/user/import")
			.field("kind", "student")
			.field("roles[]", [ role.name ])
			.field("importedCSV", path)
			.set("Cookie", cookie)

		expect(response.statusCode).toBe(RequestEnvironment.status.BAD_REQUEST)
		expect(response.body).toHaveLength(1)
		expect(response.body).toHaveProperty([ 0, "field" ], "importedCSV")
	})

	it.todo("can upload invalid student details")

	it("cannot be accessed without complete permission", async () => {
		const adminRole = await new RoleFactory()
			.userFlags(permissionGroup.generateMask("create"))
			.insertOne()
		const sampleRole = await (new RoleFactory()).insertOne()
		const { user: admin, cookie } = await App.makeAuthenticatedCookie(adminRole)
		const path = `${RequestEnvironment.root}/t/data/valid_student_details.csv`

		const response = await App.request
			.post("/api/user/import")
			.field("kind", "student")
			.field("roles[]", [ sampleRole.name ])
			.attach("importedCSV", path)
			.set("Cookie", cookie)
			.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.UNAUTHORIZED)
	})
})
