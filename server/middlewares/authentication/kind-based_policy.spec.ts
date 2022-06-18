import { UserKind } from "$/types/database"

import UserFactory from "~/factories/user"
import MockRequester from "~/set-ups/mock_requester"

import KindBasedPolicy from "./kind-based_policy"

describe("Middleware: Kind-Based Policy", () => {
	const requester  = new MockRequester()

	it("can allow unreachable employees only as expected", async () => {
		const user = await (new UserFactory()).beUnreachableEmployee().insertOne()
		const pageGuard = new KindBasedPolicy(UserKind.UnreachableEmployee)
		requester.customizeRequest({
			user,
			isAuthenticated: jest.fn().mockReturnValue(true)
		})

		requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectSuccess()
	})

	it("can allow reachable employees only as expected", async () => {
		const user = await (new UserFactory()).beReachableEmployee().insertOne()
		const pageGuard = new KindBasedPolicy(UserKind.ReachableEmployee)
		requester.customizeRequest({
			user,
			isAuthenticated: jest.fn().mockReturnValue(true)
		})

		requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectSuccess()
	})

	it("can allow students only as expected", async () => {
		const user = await (new UserFactory()).beStudent().insertOne()
		const pageGuard = new KindBasedPolicy(UserKind.Student)
		requester.customizeRequest({
			user,
			isAuthenticated: jest.fn().mockReturnValue(true)
		})

		requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectSuccess()
	})

	it("can deny students if reachable employees are expected", async () => {
		const user = await (new UserFactory()).beStudent().insertOne()
		const pageGuard = new KindBasedPolicy(UserKind.ReachableEmployee)
		requester.customizeRequest({
			user,
			isAuthenticated: jest.fn().mockReturnValue(true)
		})

		requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectFailure(requester.status.UNAUTHORIZED)
	})
})
