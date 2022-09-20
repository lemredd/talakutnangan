import "~/set-ups/email.setup"
import MockRequester from "~/set-ups/mock_requester"

import type { PreprocessedRequest } from "!/types/dependent"
import type { EmailVerificationArguments } from "!/types/independent"

import Transport from "!/helpers/email/transport"

import EmailVerification from "./email_verification"

describe("Middleware: Email Verification Sender", () => {
	const requester = new MockRequester<PreprocessedRequest<EmailVerificationArguments>>()
	const EMAIL_TEST_TIMEOUT = 7500

	it("can send to single user", async() => {
		const sender = new EmailVerification()
		requester.customizeRequest({
			"nextMiddlewareArguments": {
				"emailsToContact": [
					{
						"email": "sample@example.com",
						"id": 1
					}
				]
			}
		})

		await requester.runMiddleware(sender.intermediate.bind(sender))

		requester.expectSuccess()
		const previousMessages = Transport.consumePreviousMessages()
		expect(previousMessages).toHaveLength(1)
		expect(previousMessages[0]).toHaveProperty("message")
		expect(previousMessages[0]).toHaveProperty("message.subject", "Email Verification")
		expect(previousMessages[0].message.text).toContain("/user/verify")
		expect(previousMessages[0].message.text).toContain("sample@example.com")
		expect(previousMessages[0].message.html).toContain("/user/verify")
		expect(previousMessages[0].message.html).toContain("sample@example.com")
	}, EMAIL_TEST_TIMEOUT)

	it("can send to multiple users", async() => {
		const sender = new EmailVerification()
		requester.customizeRequest({
			"hostname": "localhost",
			"nextMiddlewareArguments": {
				"emailsToContact": [
					{
						"email": "sampleA@example.com",
						"id": 2
					},
					{
						"email": "sampleB@example.net",
						"id": 3
					}
				]
			},
			"protocol": "http"
		})

		await requester.runMiddleware(sender.intermediate.bind(sender))

		requester.expectSuccess()
		const previousMessages = Transport.consumePreviousMessages()
		expect(previousMessages).toHaveLength(2)
		const sampleAIndex = previousMessages.findIndex(
			message => message.envelope.to.includes("sampleA@example.com")
		)
		const sampleBIndex = previousMessages.findIndex(
			message => message.envelope.to.includes("sampleB@example.net")
		)
		expect(previousMessages[sampleAIndex]).toHaveProperty("message")
		expect(previousMessages[sampleAIndex]).toHaveProperty("message.subject", "Email Verification")
		expect(previousMessages[sampleAIndex].message.text).toContain("/user/verify")
		expect(previousMessages[sampleAIndex].message.text).toContain("sampleA@example.com")
		expect(previousMessages[sampleAIndex].message.html).toContain("/user/verify")
		expect(previousMessages[sampleAIndex].message.html).toContain("sampleA@example.com")
		expect(previousMessages[sampleBIndex]).toHaveProperty("message")
		expect(previousMessages[sampleBIndex]).toHaveProperty("message.subject", "Email Verification")
		expect(previousMessages[sampleBIndex].message.text).toContain("/user/verify")
		expect(previousMessages[sampleBIndex].message.text).toContain("sampleB@example.net")
		expect(previousMessages[sampleBIndex].message.html).toContain("/user/verify")
		expect(previousMessages[sampleBIndex].message.html).toContain("sampleB@example.net")
	}, EMAIL_TEST_TIMEOUT)
})
