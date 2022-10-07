import ErrorBag from "$!/errors/error_bag"
import UserFactory from "~/factories/user"
import RoleFactory from "~/factories/role"
import MockRequester from "~/setups/mock_requester"
import AuthorizationError from "$!/errors/authorization"
import { user as permissionGroup } from "$/permissions/permission_list"
import { UPDATE_ANYONE_ON_ALL_DEPARTMENTS } from "$/permissions/user_combinations"

import Controller from "./update.patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: PATCH /api/user/:id/relationships/role", () => {
	const requester = new MockRequester()

	it("can allow other user", async() => {
		const controller = new Controller()
		const { policy } = controller
		const policyFunction = policy.intermediate.bind(policy)
		const studentRole = await new RoleFactory().insertOne()
		const student = await new UserFactory().attach(studentRole).insertOne()
		const adminRole = await new RoleFactory().userFlags(
			permissionGroup.generateMask(...UPDATE_ANYONE_ON_ALL_DEPARTMENTS)
		).insertOne()
		const admin = await new UserFactory()
		.beReachableEmployee()
		.attach(adminRole)
		.serializedOne(true)
		requester.customizeRequest({
			"isAuthenticated": jest.fn(() => true),
			"params": {
				"id": student.id
			},
			"user": {
				...admin,
				"meta": {
					"hasDefaultPassword": false
				}
			}
		})

		await requester.runMiddleware(policyFunction)

		requester.expectSuccess()
	})

	it("cannot allow user to edit self", async() => {
		const controller = new Controller()
		const { policy } = controller
		const policyFunction = policy.intermediate.bind(policy)
		const adminRole = await new RoleFactory().userFlags(
			permissionGroup.generateMask(...UPDATE_ANYONE_ON_ALL_DEPARTMENTS)
		).insertOne()
		const admin = await new UserFactory()
		.beReachableEmployee()
		.attach(adminRole)
		.serializedOne(true)
		requester.customizeRequest({
			"isAuthenticated": jest.fn(() => true),
			"params": {
				"id": admin.data.id
			},
			"user": {
				...admin,
				"meta": {
					"hasDefaultPassword": false
				}
			}
		})

		await requester.runMiddleware(policyFunction)

		requester.expectFailure(AuthorizationError)
	})

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const validation = validations[BODY_VALIDATION_INDEX]
		const validationFunction = validation.intermediate.bind(validation)
		const roles = await new RoleFactory().insertMany(2)
		requester.customizeRequest({
			"body": {
				"data": [
					{
						"type": "role",
						"id": String(roles[0].id)
					},
					{
						"type": "role",
						"id": String(roles[1].id)
					}
				]
			}
		})

		await requester.runMiddleware(validationFunction)

		requester.expectSuccess()
	})

	it("cannot accept invalid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const validation = validations[BODY_VALIDATION_INDEX]
		const validationFunction = validation.intermediate.bind(validation)
		const roles = await new RoleFactory().insertMany(2)
		requester.customizeRequest({
			"body": {
				"data": [
					{
						"type": "role",
						"id": String(roles[0].id)
					},
					{
						"type": "role",
						"id": String(roles[1].id + 3)
					}
				]
			}
		})

		await requester.runMiddleware(validationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.1.id")
	})
})
