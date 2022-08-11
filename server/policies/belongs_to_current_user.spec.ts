import UserTransformer from "%/transformers/user"
import Serializer from "%/transformers/serializer"

import "~/set-ups/database.set_up"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import UserPermissions from "$/permissions/user"
import MockRequester from "~/set-ups/mock_requester"
import AuthorizationError from "$!/errors/authorization"

import BelongsToCurrentUserPolicy from "./belongs_to_current_user"

describe("Policy: Belongs to current user", () => {
	const requester  = new MockRequester()
	const transformer = new UserTransformer()
	const permissions = new UserPermissions()

	it("can allow user", async () => {
		const role = await new RoleFactory().userFlags(permissions.generateMask("view")).insertOne()
		const user = await (new UserFactory().attach(role)).insertOne()
		const pageGuard = new BelongsToCurrentUserPolicy()
		requester.customizeRequest({
			user: Serializer.serialize(user, transformer, {}),
			isAuthenticated: jest.fn().mockReturnValue(true),
			params: {
				id: String(user.id)
			}
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectSuccess()
	})

	it("cannot allow different user", async () => {
		const role = await new RoleFactory().userFlags(permissions.generateMask("view")).insertOne()
		const user = await (new UserFactory().attach(role)).insertOne()
		const pageGuard = new BelongsToCurrentUserPolicy()
		requester.customizeRequest({
			user: Serializer.serialize(user, transformer, {}),
			isAuthenticated: jest.fn().mockReturnValue(true),
			params: {
				id: String(user.id + 1)
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
