import flushPromises from "flush-promises"
import { JSON_API_MEDIA_TYPE } from "$/types/server"
import RequestEnvironment from "$!/singletons/request_environment"

import "~/setups/email.setup"
import App from "~/setups/app"
import RoleFactory from "~/factories/role"
import DepartmentFactory from "~/factories/department"

import Transport from "!/singletons/transport"
import Route from "!%/api/user/import.post"
import { IMPORT_USERS } from "$/permissions/user_combinations"
import { user as permissionGroup } from "$/permissions/permission_list"
import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"

describe("POST /api/user/import", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can upload valid student details", async() => {
		const adminRole = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...IMPORT_USERS))
		.insertOne()
		const sampleRole = await new RoleFactory().insertOne()
		await new DepartmentFactory().fullName(() => "I B C E").insertOne()
		await new DepartmentFactory().fullName(() => "I A S T E").insertOne()
		await new DepartmentFactory().fullName(() => "I H T M").insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(adminRole)
		const path = `${RequestEnvironment.root}/t/data/valid_student_details.csv`

		const response = await App.request
		.post("/api/user/import")
		.field("data[type]", "user")
		.field("data[attributes][kind]", "student")
		.field("data[relationships][roles][data][0][type]", "role")
		.field("data[relationships][roles][data][0][id]", sampleRole.id)
		.attach("meta[importedCSV]", path)
		.set("Cookie", cookie)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.CREATED)
		expect(response.body.data).toHaveLength(3)
		expect(response.body.included).toHaveLength(7)

		// Policy middleware runs
		await flushPromises()
		// Middleware intermediate runs
		await flushPromises()
		// E-mail template read for first user
		await flushPromises()
		// E-mail template read for second user
		await flushPromises()
		// E-mail template read for third user
		await flushPromises()
		// E-mail message transmission to first user
		await flushPromises()
		// E-mail message transmission to second user
		await flushPromises()
		// E-mail message transmission to third user
		await flushPromises()

		// Waiting for all transmissions to finish
		await new Promise(resolve => {
			setTimeout(resolve, convertTimeToMilliseconds("00:00:01"))
		})

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
	}, convertTimeToMilliseconds("00:00:10"))

	it("can upload valid reachable employee details", async() => {
		const adminRole = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...IMPORT_USERS))
		.insertOne()
		const sampleRole = await new RoleFactory().insertOne()
		await new DepartmentFactory().fullName(() => "I B C E").insertOne()
		await new DepartmentFactory().fullName(() => "S A S S").mayNotAdmit().insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(adminRole)
		const path = `${RequestEnvironment.root}/t/data/valid_reachable_employee_details.csv`

		const response = await App.request
		.post("/api/user/import")
		.field("data[type]", "user")
		.field("data[attributes][kind]", "reachable_employee")
		.field("data[relationships][roles][data][0][type]", "role")
		.field("data[relationships][roles][data][0][id]", sampleRole.id)
		.attach("meta[importedCSV]", path)
		.set("Cookie", cookie)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.CREATED)
		expect(response.body.data).toHaveLength(2)
		expect(response.body.included).toHaveLength(13)

		// Policy middleware runs
		await flushPromises()
		// Middleware intermediate runs
		await flushPromises()
		// E-mail template read for first user
		await flushPromises()
		// E-mail template read for second user
		await flushPromises()
		// E-mail template read for third user
		await flushPromises()
		// E-mail message transmission to first user
		await flushPromises()
		// E-mail message transmission to second user
		await flushPromises()
		// E-mail message transmission to third user
		await flushPromises()
		await flushPromises()

		// Waiting for all transmissions to finish
		await new Promise(resolve => {
			setTimeout(resolve, convertTimeToMilliseconds("00:00:01"))
		})

		const previousMessages = Transport.consumePreviousMessages()
		expect(previousMessages).toHaveLength(2)
		expect(previousMessages[0]).toHaveProperty("message")
		expect(previousMessages[0]).toHaveProperty("message.subject", "New User in Talakutnangan")
		expect(previousMessages[0].message.text).toContain("Candice Surie")
		expect(previousMessages[0].message.text).toContain("candice.surie@mcc.edu.ph")
		expect(previousMessages[0].message.text).toContain("reachable employee")
		expect(previousMessages[1]).toHaveProperty("message.subject", "New User in Talakutnangan")
		expect(previousMessages[1].message.text).toContain("Daisy Loneg")
		expect(previousMessages[1].message.text).toContain("daisy.loneg@mcc.edu.ph")
		expect(previousMessages[1].message.text).toContain("reachable employee")
	}, convertTimeToMilliseconds("00:00:10"))

	it("cannot upload by text field", async() => {
		const adminRole = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...IMPORT_USERS))
		.insertOne()
		const role = await new RoleFactory().insertOne()
		await new DepartmentFactory().fullName(() => "I B C E").insertOne()
		await new DepartmentFactory().fullName(() => "I A S T E").insertOne()
		await new DepartmentFactory().fullName(() => "I H T M").insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(adminRole)
		const path = `${RequestEnvironment.root}/t/data/valid_student_details.csv`

		const response = await App.request
		.post("/api/user/import")
		.field("data[type]", "user")
		.field("data[attributes][kind]", "student")
		.field("data[relationships][roles][data][0][type]", "role")
		.field("data[relationships][roles][data][0][id]", role.id)
		.field("meta[importedCSV]", path)
		.set("Cookie", cookie)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.BAD_REQUEST)
		expect(response.body.errors).toHaveLength(1)
		expect(response.body).toHaveProperty("errors.0.source.pointer", "meta.importedCSV")
	})

	it("cannot upload invalid student details", async() => {
		const adminRole = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...IMPORT_USERS))
		.insertOne()
		const sampleRole = await new RoleFactory().insertOne()
		await new DepartmentFactory().fullName(() => "I B C E").insertOne()
		await new DepartmentFactory().fullName(() => "I A S T E").insertOne()
		await new DepartmentFactory().fullName(() => "S A S S").mayNotAdmit().insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(adminRole)
		const path = `${RequestEnvironment.root}/t/data/invalid_student_details.csv`

		const response = await App.request
		.post("/api/user/import")
		.field("data[type]", "user")
		.field("data[attributes][kind]", "student")
		.field("data[relationships][roles][data][0][type]", "role")
		.field("data[relationships][roles][data][0][id]", sampleRole.id)
		.attach("meta[importedCSV]", path)
		.set("Cookie", cookie)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.BAD_REQUEST)
		expect(response.body.errors).toHaveLength(2)
		expect(response.body).toHaveProperty(
			"errors.0.source.pointer",
			"meta.importedCSV.0.studentNumber"
		)
	}, convertTimeToMilliseconds("00:00:10"))
})
