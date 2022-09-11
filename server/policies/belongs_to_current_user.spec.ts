import "~/set-ups/database.set_up"
import UserManager from "%/managers/user"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import UserPermissions from "$/permissions/user"
import MockRequester from "~/set-ups/mock_requester"
import AuthorizationError from "$!/errors/authorization"

import BelongsToCurrentUserPolicy from "./belongs_to_current_user"

describe("Policy: Belongs to current user", () => {
	const requester = new MockRequester()
	const permissions = new UserPermissions()

	it("can allow user", async() => {
		const userFactory = new UserFactory()
		const role = await new RoleFactory().userFlags(permissions.generateMask("view")).insertOne()
		const user = await userFactory.attach(role).serializedOne(true)
		const pageGuard = new BelongsToCurrentUserPolicy(UserManager)
		requester.customizeRequest({
			"isAuthenticated": jest.fn().mockReturnValue(true),
			"params": {
				"id": String(user.data.id)
			},
			user
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectSuccess()
	})

	it("cannot allow different user", async() => {
		const userFactory = new UserFactory()
		const role = await new RoleFactory().userFlags(permissions.generateMask("view")).insertOne()
		const user = await userFactory.attach(role).serializedOne(true)
		const otherUser = await userFactory.serializedOne(true)
		const pageGuard = new BelongsToCurrentUserPolicy(UserManager)
		requester.customizeRequest({
			"isAuthenticated": jest.fn().mockReturnValue(true),
			"params": {
				"id": String(user.data.id)
			},
			"user": otherUser
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectNext([
			[
				(error: any) => expect(error).toBeInstanceOf(AuthorizationError)
			]
		])
	})
})
