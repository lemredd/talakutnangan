import "~/setups/database.setup"
import UserFactory from "~/factories/user"
import UserTransformer from "%/transformers/user"
import Serializer from "%/transformers/serializer"
import MockRequester from "~/setups/mock_requester"
import AuthorizationError from "$!/errors/authorization"

import KindBasedPolicy from "./kind-based"

describe("Middleware: Kind-Based Policy", () => {
	const requester = new MockRequester()

	it("can allow unreachable employees only as expected", async() => {
		const serializedUser = await new UserFactory().beUnreachableEmployee().serializedOne()

		const pageGuard = new KindBasedPolicy("unreachable_employee")
		requester.customizeRequest({
			"isAuthenticated": jest.fn().mockReturnValue(true),
			"user": serializedUser
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectSuccess()
	})

	it("can allow reachable employees only as expected", async() => {
		const serializedUser = await new UserFactory().beReachableEmployee().serializedOne()

		const pageGuard = new KindBasedPolicy("reachable_employee")
		requester.customizeRequest({
			"isAuthenticated": jest.fn().mockReturnValue(true),
			"user": serializedUser
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectSuccess()
	})

	it("can allow students only as expected", async() => {
		const serializedUser = await new UserFactory().beStudent().serializedOne()

		const pageGuard = new KindBasedPolicy("student")
		requester.customizeRequest({
			"isAuthenticated": jest.fn().mockReturnValue(true),
			"user": serializedUser
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectSuccess()
	})

	it("can deny students if reachable employees are expected", async() => {
		const serializedUser = await new UserFactory().beStudent().serializedOne()

		const pageGuard = new KindBasedPolicy("reachable_employee")
		requester.customizeRequest({
			"isAuthenticated": jest.fn().mockReturnValue(true),
			"user": serializedUser
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectNext([
			[
				(error: any) => expect(error).toBeInstanceOf(AuthorizationError)
			]
		])
	})

	it("can allow student or reachable employees only as expected", async() => {
		const serializedUser = await new UserFactory().beReachableEmployee().serializedOne()

		const pageGuard = new KindBasedPolicy("student", "reachable_employee")
		requester.customizeRequest({
			"isAuthenticated": jest.fn().mockReturnValue(true),
			"user": serializedUser
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectSuccess()
	})

	it("can deny unreachable employee if student or reachable employees are expected", async() => {
		const serializedUser = await new UserFactory().beUnreachableEmployee().serializedOne()

		const pageGuard = new KindBasedPolicy("student", "reachable_employee")
		requester.customizeRequest({
			"isAuthenticated": jest.fn().mockReturnValue(true),
			"user": serializedUser
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectNext([
			[
				(error: any) => expect(error).toBeInstanceOf(AuthorizationError)
			]
		])
	})
})
