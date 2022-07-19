import UserFactory from "~/factories/user"
import MockRequester from "~/set-ups/mock_requester"
import AuthorizationError from "$!/errors/authorization"

import UserTransformer from "%/transformers/user"
import Serializer from "%/transformers/serializer"

import KindBasedPolicy from "./kind-based_policy"

describe("Middleware: Kind-Based Policy", () => {
	const requester  = new MockRequester()

	it("can allow unreachable employees only as expected", async () => {
		const rawUser = await (new UserFactory()).beUnreachableEmployee().insertOne()
		const serializedUser = Serializer.serialize(
			rawUser,
			new UserTransformer(),
			{}
		)
		const pageGuard = new KindBasedPolicy("unreachable_employee")
		requester.customizeRequest({
			user: serializedUser,
			isAuthenticated: jest.fn().mockReturnValue(true)
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectSuccess()
	})

	it("can allow reachable employees only as expected", async () => {
		const rawUser = await (new UserFactory()).beUnreachableEmployee().insertOne()
		const serializedUser = Serializer.serialize(
			rawUser,
			new UserTransformer(),
			{}
		)
		const pageGuard = new KindBasedPolicy("reachable_employee")
		requester.customizeRequest({
			user: serializedUser,
			isAuthenticated: jest.fn().mockReturnValue(true)
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectSuccess()
	})

	it("can allow students only as expected", async () => {
		const rawUser = await (new UserFactory()).beUnreachableEmployee().insertOne()
		const serializedUser = Serializer.serialize(
			rawUser,
			new UserTransformer(),
			{}
		)
		const pageGuard = new KindBasedPolicy("student")
		requester.customizeRequest({
			user: serializedUser,
			isAuthenticated: jest.fn().mockReturnValue(true)
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectSuccess()
	})

	it("can deny students if reachable employees are expected", async () => {
		const rawUser = await (new UserFactory()).beUnreachableEmployee().insertOne()
		const serializedUser = Serializer.serialize(
			rawUser,
			new UserTransformer(),
			{}
		)
		const pageGuard = new KindBasedPolicy("reachable_employee")
		requester.customizeRequest({
			user: serializedUser,
			isAuthenticated: jest.fn().mockReturnValue(true)
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectNext([
			[
				(error: any) => expect(error).toBeInstanceOf(AuthorizationError)
			]
		])
	})
})
