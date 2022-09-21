import "~/setups/email.setup"
import MockRequester from "~/setups/mock_requester"

import type { PreprocessedRequest } from "!/types/dependent"
import type { PasswordResetArguments } from "!/types/independent"

import Transport from "!/helpers/email/transport"

import PasswordResetNotification from "./password_reset_notification"

describe("Middleware: New User Notifier", () => {
	const requester = new MockRequester<PreprocessedRequest<PasswordResetArguments>>()

	it("can notify to user with default password", async() => {
		const sender = new PasswordResetNotification()
		requester.customizeRequest({
			"nextMiddlewareArguments": <PasswordResetArguments>{
				"emailToContact": {
					"email": "sampleA@example.com",
					"name": "Sample A",
					"password": "12345678"
				}
			}
		})

		await requester.runMiddleware(sender.intermediate.bind(sender))

		requester.expectSuccess()
		const previousMessages = Transport.consumePreviousMessages()
		expect(previousMessages).toHaveLength(1)
		expect(previousMessages[0]).toHaveProperty("message")
		expect(previousMessages[0]).toHaveProperty(
			"message.subject",
			"Password Reset in Talakutnangan"
		)
		expect(previousMessages[0].message.text).toContain("Sample A")
		expect(previousMessages[0].message.text).toContain("sampleA@example.com")
		expect(previousMessages[0].message.text).toContain("12345678")
		expect(previousMessages[0].message.html).toContain("Sample A")
		expect(previousMessages[0].message.html).toContain("sampleA@example.com")
		expect(previousMessages[0].message.html).toContain("12345678")
	})
})
