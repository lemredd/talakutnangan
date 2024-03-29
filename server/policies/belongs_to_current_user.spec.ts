import "~/setups/database.setup"
import UserManager from "%/managers/user"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import UserPermissions from "$/permissions/user"
import MockRequester from "~/setups/mock_requester"
import AuthorizationError from "$!/errors/authorization"

import BelongsToCurrentUserPolicy from "./belongs_to_current_user"

describe("Policy: Belongs to current user", () => {
	const requester = new MockRequester()
	const permissions = new UserPermissions()

	it("can allow user", async() => {
		const userFactory = new UserFactory()
		const role = await new RoleFactory().userFlags(permissions.generateFlags("view")).insertOne()
		const user = await userFactory.attach(role).serializedOne(true)
		const pageGuard = new BelongsToCurrentUserPolicy(UserManager)
		requester.customizeRequest({
			"isAuthenticated": jest.fn().mockReturnValue(true),
			"params": {
				"id": String(user.data.id)
			},
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

	it("can allow different user if permitted", async() => {
		const userFactory = new UserFactory()
		const role = await new RoleFactory().userFlags(permissions.generateFlags("view")).insertOne()
		const adminRole = await new RoleFactory()
		.userFlags(permissions.generateFlags("readDepartmentScope"))
		.insertOne()
		const user = await userFactory.attach(role).serializedOne(true)
		const otherUser = await userFactory.attach(adminRole).serializedOne(true)
		const pageGuard = new BelongsToCurrentUserPolicy(UserManager, {
			"bypassNecessarilyWith": {
				"combinations": [
					[ "readDepartmentScope" ]
				],
				"group": permissions
			}
		})
		requester.customizeRequest({
			"isAuthenticated": jest.fn().mockReturnValue(true),
			"params": {
				"id": String(user.data.id)
			},
			"user": {
				...otherUser,
				"meta": {
					"hasDefaultPassword": false
				}
			}
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectSuccess()
	})

	it("cannot allow different user without required permission", async() => {
		const userFactory = new UserFactory()
		const role = await new RoleFactory().userFlags(permissions.generateFlags("view")).insertOne()
		const user = await userFactory.attach(role).serializedOne(true)
		const otherUser = await userFactory.serializedOne(true)
		const pageGuard = new BelongsToCurrentUserPolicy(UserManager, {
			"bypassNecessarilyWith": {
				"combinations": [
					[ "readDepartmentScope" ]
				],
				"group": permissions
			}
		})
		requester.customizeRequest({
			"isAuthenticated": jest.fn().mockReturnValue(true),
			"params": {
				"id": String(user.data.id)
			},
			"user": {
				...otherUser,
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
})
