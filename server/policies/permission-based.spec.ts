import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import UserPermissions from "$/permissions/user"
import UserTransformer from "%/transformers/user"
import Serializer from "%/transformers/serializer"
import MockRequester from "~/set-ups/mock_requester"
import setUpDatabase from "~/set-ups/database.set_up"
import AuthorizationError from "$!/errors/authorization"

import PermissionBasedPolicy from "./permission-based"

describe("Middleware: Permission-Based Policy", () => {
	setUpDatabase()

	const requester  = new MockRequester()
	const transformer = new UserTransformer()
	const permissions = new UserPermissions()

	it("can allow users with permission", async () => {
		const role = await new RoleFactory().userFlags(permissions.generateMask("view")).insertOne()
		const user = await (new UserFactory().attach(role)).insertOne()
		const pageGuard = new PermissionBasedPolicy(permissions, [
			[ "view" ]
		])
		requester.customizeRequest({
			user: Serializer.serialize(user, transformer, {}),
			isAuthenticated: jest.fn().mockReturnValue(true)
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectSuccess()
	})

	it("can execute extra checks", async () => {
		const extraCheck = jest.fn()
		const role = await new RoleFactory().userFlags(permissions.generateMask("view")).insertOne()
		const user = await (new UserFactory().attach(role)).insertOne()
		const pageGuard = new PermissionBasedPolicy(permissions, [
			[ "view" ]
		], extraCheck)
		requester.customizeRequest({
			user: Serializer.serialize(user, transformer, {}),
			isAuthenticated: jest.fn().mockReturnValue(true)
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		const request = requester.expectSuccess()
		expect(extraCheck).toHaveBeenCalled()
		expect(extraCheck.mock.calls[0][0]).toStrictEqual(request)
	})

	it("can allow users with permission on different combination", async () => {
		const role = await new RoleFactory().userFlags(permissions.generateMask(
			"view",
			"update",
			"writeOwnScope"
		)).insertOne()
		const user = await (new UserFactory().attach(role)).insertOne()
		const pageGuard = new PermissionBasedPolicy(permissions, [
			[ "create" ],
			[ "update", "writeOwnScope" ]
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
			[ "create" ]
		])
		requester.customizeRequest({
			user: Serializer.serialize(user, transformer, {}),
			isAuthenticated: jest.fn().mockReturnValue(true)
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectNext([
			[
				(error: any) => expect(error).toBeInstanceOf(AuthorizationError)
			]
		])
	})

	it("can deny guest", async () => {
		const pageGuard = new PermissionBasedPolicy(permissions, [
			[ "create" ]
		])
		requester.customizeRequest({
			user: null,
			isAuthenticated: jest.fn().mockReturnValue(false)
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectNext([
			[
				(error: any) => expect(error).toBeInstanceOf(AuthorizationError)
			]
		])
	})
})
