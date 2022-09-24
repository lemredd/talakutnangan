import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserDocument } from "$/types/documents/user"

import "~/setups/database.setup"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import deserialize from "$/object/deserialize"
import UserPermissions from "$/permissions/user"
import MockRequester from "~/setups/mock_requester"
import DepartmentFactory from "~/factories/department"
import AuthorizationError from "$!/errors/authorization"

import Middleware from "./scope-based"

describe("Middleware: Scope-Based Policy", () => {
	const requester = new MockRequester()
	const permissions = new UserPermissions()

	it("can allow users with narrow scope", async() => {
		const role = await new RoleFactory()
		.userFlags(permissions.generateMask("update", "writeOwnScope"))
		.insertOne()
		const user = await new UserFactory().attach(role).insertOne()
		const pageGuard = new Middleware(
			permissions,
			[ "update", "writeOwnScope" ],
			[ "update", "writeDepartmentScope" ],
			[ "update", "writeOverallScope" ],
			(request: AuthenticatedRequest): Promise<DeserializedUserDocument<
				"roles"|"department"
			>> => {
				const owner = deserialize(request.user) as DeserializedUserDocument<
					"roles"|"department"
				>
				return Promise.resolve(owner)
			}
		)
		requester.customizeRequest({
			"isAuthenticated": jest.fn().mockReturnValue(true),
			"user": new UserFactory().serialize(user)
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectSuccess()
	})

	it("can allow users with social scope to invoke for others", async() => {
		const department = await new DepartmentFactory().insertOne()
		const role = await new RoleFactory()
		.userFlags(permissions.generateMask("update", "writeDepartmentScope"))
		.insertOne()
		const user = await new UserFactory().attach(role).in(department).insertOne()
		const pageGuard = new Middleware(
			permissions,
			[ "update", "writeOwnScope" ],
			[ "update", "writeDepartmentScope" ],
			[ "update", "writeOverallScope" ],
			async(): Promise<DeserializedUserDocument<"roles"|"department">> => {
				const owner = await new UserFactory().attach(role).in(department).insertOne()
				return new UserFactory().deserialize(owner) as DeserializedUserDocument<
					"roles"|"department"
				>
			}
		)
		requester.customizeRequest({
			"isAuthenticated": jest.fn().mockReturnValue(true),
			"user": new UserFactory().serialize(user)
		})

		await requester.runMiddleware(pageGuard.intermediate.bind(pageGuard))

		requester.expectSuccess()
	})

	it("cannot allow users with narrow scope to invoke for others", async() => {
		const role = await new RoleFactory()
		.userFlags(permissions.generateMask("update", "writeOwnScope"))
		.insertOne()
		const user = await new UserFactory().attach(role).insertOne()
		const middleware = new Middleware(
			permissions,
			[ "update", "writeOwnScope" ],
			[ "update", "writeDepartmentScope" ],
			[ "update", "writeOverallScope" ],
			async(): Promise<DeserializedUserDocument<"roles"|"department">> => {
				const owner = await new UserFactory().attach(role).insertOne()
				return new UserFactory().deserialize(
					owner
				) as DeserializedUserDocument<"roles"|"department">
			}
		)
		requester.customizeRequest({
			"isAuthenticated": jest.fn().mockReturnValue(true),
			"user": new UserFactory().serialize(user)
		})

		await requester.runMiddleware(middleware.intermediate.bind(middleware))

		requester.expectFailure(AuthorizationError)
	})
})
