import "~/setups/database.setup"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import UserPermissions from "$/permissions/user"
import MockRequester from "~/setups/mock_requester"
import AuthorizationError from "$!/errors/authorization"

import PermissionBasedPolicy from "./permission-based"

describe("Middleware: Permission-Based Policy", () => {
	const requester = new MockRequester()
	const permissions = new UserPermissions()

	it("can allow users with permission", async() => {
		const role = await new RoleFactory().userFlags(permissions.generateMask("view")).insertOne()
		const user = await new UserFactory().attach(role).serializedOne()
		const pageGuard = new PermissionBasedPolicy(permissions, [
			[ "view" ]
		])
		requester.customizeRequest({
			"isAuthenticated": jest.fn().mockReturnValue(true),
			"user": {
				...user,
				"meta": {
					"hasDefaultPassword": false
				}
			}
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectSuccess()
	})

	it("can execute extra checks", async() => {
		const extraCheck = jest.fn()
		const role = await new RoleFactory().userFlags(permissions.generateMask("view")).insertOne()
		const user = await new UserFactory().attach(role).serializedOne()
		const pageGuard = new PermissionBasedPolicy(permissions, [
			[ "view" ]
		], {
			"checkOthers": extraCheck
		})
		requester.customizeRequest({
			"isAuthenticated": jest.fn().mockReturnValue(true),
			"user": {
				...user,
				"meta": {
					"hasDefaultPassword": false
				}
			}
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		const request = requester.expectSuccess()
		expect(extraCheck).toHaveBeenCalled()
		expect(extraCheck.mock.calls[0][0]).toStrictEqual(request)
	})

	it("can allow users with permission on different combination", async() => {
		const role = await new RoleFactory().userFlags(permissions.generateMask(
			"view",
			"update",
			"writeOwnScope"
		)).insertOne()
		const user = await new UserFactory().attach(role).serializedOne()
		const pageGuard = new PermissionBasedPolicy(permissions, [
			[ "create" ],
			[ "update", "writeOwnScope" ]
		])
		requester.customizeRequest({
			"isAuthenticated": jest.fn().mockReturnValue(true),
			"user": {
				...user,
				"meta": {
					"hasDefaultPassword": false
				}
			}
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectSuccess()
	})

	it("cannot allow users without permission", async() => {
		const role = await new RoleFactory().userFlags(permissions.generateMask("view")).insertOne()
		const user = await new UserFactory().attach(role).serializedOne()
		const pageGuard = new PermissionBasedPolicy(permissions, [
			[ "create" ]
		])
		requester.customizeRequest({
			"isAuthenticated": jest.fn().mockReturnValue(true),
			"user": {
				...user,
				"meta": {
					"hasDefaultPassword": false
				}
			}
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectNext([
			[
				(error: any) => expect(error).toBeInstanceOf(AuthorizationError)
			]
		])
	})

	it("cannot allow guest", async() => {
		const pageGuard = new PermissionBasedPolicy(permissions, [
			[ "create" ]
		])
		requester.customizeRequest({
			"isAuthenticated": jest.fn().mockReturnValue(false),
			"user": null
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectNext([
			[
				(error: any) => expect(error).toBeInstanceOf(AuthorizationError)
			]
		])
	})
})
