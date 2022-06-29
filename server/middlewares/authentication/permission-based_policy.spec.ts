import UserTransformer from "%/transformers/user"
import Serializer from "%/transformers/serializer"

import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import MockRequester from "~/set-ups/mock_requester"
import UserPermissions from "$/permissions/user_permissions"

import PermissionBasedPolicy from "./permission-based_policy"

describe("Middleware: Kind-Based Policy", () => {
	const requester  = new MockRequester()
	const transformer = new UserTransformer()
	const permissions = new UserPermissions()

	it("can allow users with permission", async () => {
		const role = await new RoleFactory().userFlags(permissions.generateMask("view")).insertOne()
		const user = await (new UserFactory().attach(role)).insertOne()
		const pageGuard = new PermissionBasedPolicy(permissions, [
			"view"
		])
		requester.customizeRequest({
			user: Serializer.serialize(user, transformer, {}),
			isAuthenticated: jest.fn().mockReturnValue(true)
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectSuccess()
	})

	it("can deny users without permission", async () => {
		const role = await new RoleFactory().userFlags(permissions.generateMask("view")).insertOne()
		const user = await (new UserFactory().attach(role)).insertOne()
		const pageGuard = new PermissionBasedPolicy(permissions, [
			"create"
		])
		requester.customizeRequest({
			user: Serializer.serialize(user, transformer, {}),
			isAuthenticated: jest.fn().mockReturnValue(true)
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectFailure(requester.status.UNAUTHORIZED)
	})

	it("can deny guest", async () => {
		const pageGuard = new PermissionBasedPolicy(permissions, [
			"create"
		])
		requester.customizeRequest({
			user: null,
			isAuthenticated: jest.fn().mockReturnValue(false)
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectFailure(requester.status.UNAUTHORIZED)
	})
})
