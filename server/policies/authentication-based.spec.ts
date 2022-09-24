import MockRequester from "~/setups/mock_requester"

import AuthorizationError from "$!/errors/authorization"
import AuthenticationBasedPolicy from "./authentication-based"

describe("Middleware: Authenticated-Based Policy", () => {
	const requester  = new MockRequester()

	it("can allow guest users if guests are expected", async () => {
		const authenticatedGuard = new AuthenticationBasedPolicy(false)
		requester.customizeRequest({
			isAuthenticated: jest.fn().mockReturnValue(false)
		})

		await requester.runMiddleware(authenticatedGuard.intermediate.bind(authenticatedGuard))

		requester.expectSuccess()
	})

	it("can deny known users if guest are expected", async () => {
		const authenticatedGuard = new AuthenticationBasedPolicy(false)
		requester.customizeRequest({
			isAuthenticated: jest.fn().mockReturnValue(true)
		})

		await requester.runMiddleware(authenticatedGuard.intermediate.bind(authenticatedGuard))

		requester.expectNext([
			[
				(error: any) => expect(error).toBeInstanceOf(AuthorizationError)
			]
		])
	})

	it("can allow known users if known are expected", async () => {
		const authenticatedGuard = new AuthenticationBasedPolicy(true)
		requester.customizeRequest({
			isAuthenticated: jest.fn().mockReturnValue(true)
		})

		await requester.runMiddleware(authenticatedGuard.intermediate.bind(authenticatedGuard))

		requester.expectSuccess()
	})


	it("can deny guest users if known are expected", async () => {
		const authenticatedGuard = new AuthenticationBasedPolicy(true)
		requester.customizeRequest({
			isAuthenticated: jest.fn().mockReturnValue(false)
		})

		await requester.runMiddleware(authenticatedGuard.intermediate.bind(authenticatedGuard))

		requester.expectNext([
			[
				(error: any) => expect(error).toBeInstanceOf(AuthorizationError)
			]
		])
	})
})
