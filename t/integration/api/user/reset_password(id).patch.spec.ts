import flushPromises from "flush-promises"
import { JSON_API_MEDIA_TYPE } from "$/types/server"
import RequestEnvironment from "$!/singletons/request_environment"

import "~/setups/email.setup"
import App from "~/setups/app"
import User from "%/models/user"
import compare from "$!/auth/compare"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import Transport from "!/helpers/email/transport"
import StudentDetail from "%/models/student_detail"
import { RESET_PASSWORD } from "$/permissions/user_combinations"
import Route from "!%/api/user/reset_password(id).patch"
import { user as permissionGroup } from "$/permissions/permission_list"

describe("PATCH /api/user/reset_password/:id", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by permitted user and reset other user", async () => {
		const adminRole = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...RESET_PASSWORD))
			.insertOne()
		const { user: admin, cookie } = await App.makeAuthenticatedCookie(adminRole)
		const student = await (new UserFactory()).insertOne()
		const studentNumber = "1234-123"
		await StudentDetail.create({
			userID: student.id,
			studentNumber
		})

		const response = await App.request
			.patch(`/api/user/reset_password/${student.id}`)
			.send({
				data: {
					type: "user",
					id: String(student.id)
				}
			})
			.set("Cookie", cookie)
			.type(JSON_API_MEDIA_TYPE)
			.accept(JSON_API_MEDIA_TYPE)

		console.log(response.body)
		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)

		const updatedStudent = await User.findOne({ where: { id: student.id } })
		expect(compare(studentNumber, updatedStudent!.password)).resolves.toBeTruthy()

		await flushPromises() // Middleware intermediate runs
		await flushPromises() // E-mail template read
		await flushPromises() // E-mail message transmission
		const previousMessages = Transport.consumePreviousMessages()
		expect(previousMessages).toHaveLength(1)
		expect(previousMessages[0]).toHaveProperty("message")
		expect(previousMessages[0]).toHaveProperty(
			"message.subject",
			"Password Reset in Talakutnangan"
		)
		expect(previousMessages[0].message.text).toContain(updatedStudent!.name)
		expect(previousMessages[0].message.text).toContain(updatedStudent!.email)
		expect(previousMessages[0].message.text).toContain(studentNumber)
		expect(previousMessages[0].message.html).toContain(updatedStudent!.name)
		expect(previousMessages[0].message.html).toContain(updatedStudent!.email)
		expect(previousMessages[0].message.html).toContain(studentNumber)
	})
})
