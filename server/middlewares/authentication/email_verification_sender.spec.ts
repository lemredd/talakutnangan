import "~/set-ups/email.set_up"
import MockRequester from "~/set-ups/mock_requester"

import type { EmailRequest } from "!/types/dependent"

import Transport from "!/helpers/email/transport"

import EmailVerificationSender from "./email_verification_sender"

describe("Middleware: Email Verification Sender", () => {
	const requester  = new MockRequester<EmailRequest>()

	it("can send to single user", async () => {
		const sender = new EmailVerificationSender()
		requester.customizeRequest({
			protocol: "http",
			hostname: "localhost",
			emailsToContact: [ "sample@example.com" ]
		})

		await requester.runMiddleware(sender.intermediate.bind(sender))

		requester.expectSuccess()
		const previousMessages = Transport.consumePreviousMessages()
		expect(previousMessages).toHaveLength(1)
		expect(previousMessages[0]).toHaveProperty("message")
		expect(previousMessages[0]).toHaveProperty("message.subject", "Email Verification")
		expect(previousMessages[0].message.text).toMatchSnapshot()
		expect(previousMessages[0].message.html).toMatchSnapshot()
	})

	it("can send to multiple users", async () => {
		const sender = new EmailVerificationSender()
		requester.customizeRequest({
			protocol: "http",
			hostname: "localhost",
			emailsToContact: [ "sampleA@example.com", "sampleB@example.net" ]
		})

		await requester.runMiddleware(sender.intermediate.bind(sender))

		requester.expectSuccess()
		const previousMessages = Transport.consumePreviousMessages()
		expect(previousMessages).toHaveLength(2)
		expect(previousMessages[0]).toHaveProperty("message")
		expect(previousMessages[0]).toHaveProperty("message.subject", "Email Verification")
		expect(previousMessages[0].message.text).toMatchSnapshot()
		expect(previousMessages[0].message.html).toMatchSnapshot()
		expect(previousMessages[1].message.text).toMatchSnapshot()
		expect(previousMessages[1].message.html).toMatchSnapshot()
	})
})
