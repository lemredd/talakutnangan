import "~/set-ups/database.set_up"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import UserPermissions from "$/permissions/user"
import UserTransformer from "%/transformers/user"
import Serializer from "%/transformers/serializer"
import MockRequester from "~/set-ups/mock_requester"
import AuthorizationError from "$!/errors/authorization"

import Middleware from "./scope-based"

describe("Middleware: Permission-Based Policy", () => {
	const requester = new MockRequester()
	const transformer = new UserTransformer()
	const permissions = new UserPermissions()

	it("can allow users with narrow scope", async() => {
		const role = await new RoleFactory()
		.userFlags(permissions.generateMask("update", "writeOwnScope"))
		.insertOne()
		const user = await new UserFactory().attach(role).insertOne()
		const pageGuard = new Middleware(permissions, [ "update", "writeOwnScope" ], [
			[ "update", "writeDepartmentScope" ],
			[ "update", "writeOverallScope" ]
		])
		requester.customizeRequest({
			"isAuthenticated": jest.fn().mockReturnValue(true),
			"params": {
				"id": String(user.id)
			},
			"user": Serializer.serialize(user, transformer, {})
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectSuccess()
	})

	it("can allow users with wide scope to invoke for others", async() => {
		const role = await new RoleFactory()
		.userFlags(permissions.generateMask("update", "writeDepartmentScope"))
		.insertOne()
		const user = await new UserFactory().attach(role).insertOne()
		const pageGuard = new Middleware(permissions, [ "update", "writeOwnScope" ], [
			[ "update", "writeDepartmentScope" ],
			[ "update", "writeOverallScope" ]
		])
		requester.customizeRequest({
			"isAuthenticated": jest.fn().mockReturnValue(true),
			"params": {
				"id": `${user.id}1`
			},
			"user": Serializer.serialize(user, transformer, {})
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectSuccess()
	})

	it("cannot allow users with narrow scope to invoke for others", async() => {
		const role = await new RoleFactory()
		.userFlags(permissions.generateMask("update", "writeOwnScope"))
		.insertOne()
		const user = await new UserFactory().attach(role).insertOne()
		const pageGuard = new Middleware(permissions, [ "update", "writeOwnScope" ], [
			[ "update", "writeDepartmentScope" ],
			[ "update", "writeOverallScope" ]
		])
		requester.customizeRequest({
			"isAuthenticated": jest.fn().mockReturnValue(true),
			"params": {
				"id": `${user.id}1`
			},
			"user": Serializer.serialize(user, transformer, {})
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectFailure(AuthorizationError)
	})
})
