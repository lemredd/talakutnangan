import type { Request } from "!/types/dependent"
import type { Serializable } from "$/types/general"
import type {
	ValidationConstraints,
	DoesBelongToCurrentUserConstraints
} from "!/types/validation"

import "~/set-ups/database.set_up"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import Manager from "%/managers/employee_schedule"
import Factory from "~/factories/employee_schedule"
import makeInitialState from "!/validators/make_initial_state"
import { Permissions as UserPermissions } from "$/permissions/user"
import { user as permissionGroup } from "$/permissions/permission_list"
import {
	UPDATE_OWN_DATA,
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"
import doesBelongToUser from "./does_belong_to_user"

describe("Validator: does belong to user", () => {
	it("can accept valid input", async() => {
		const START_TIME = 1
		const END_TIME = 300
		const role = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...UPDATE_OWN_DATA))
		.insertOne()
		const userFactory = new UserFactory()
		const user = await userFactory.attach(role).insertOne()
		const model = await new Factory()
		.user(() => Promise.resolve(user))
		.scheduleStart(() => START_TIME)
		.scheduleEnd(() => END_TIME)
		.insertOne()
		const value = Promise.resolve(makeInitialState(model.id))
		const constraints = {
			"doesBelongToUser": {
				"anyPermissionCombinationForBypass": [
					UPDATE_ANYONE_ON_OWN_DEPARTMENT,
					UPDATE_ANYONE_ON_ALL_DEPARTMENTS
				],
				permissionGroup,
			},
			"field": "hello",
			"manager": {
				"className": Manager,
				"columnName": "id"
			},
			"request": {
				"user": userFactory.serialize(user) as Serializable
			} as Request,
			"source": {}
		} as unknown as ValidationConstraints<Request>
		& Partial<DoesBelongToCurrentUserConstraints<UserPermissions>>

		const sanitizeValue = (await doesBelongToUser(value, constraints)).value

		expect(sanitizeValue).toEqual(model.id)
	})

	it("can bypass if it does not own the resurce", async() => {
		const START_TIME = 2
		const END_TIME = 300
		const role = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...UPDATE_ANYONE_ON_OWN_DEPARTMENT))
		.insertOne()
		const userFactory = new UserFactory()
		const admin = await userFactory.attach(role).insertOne()
		const user = await userFactory.insertOne()
		const model = await new Factory()
		.user(() => Promise.resolve(user))
		.scheduleStart(() => START_TIME)
		.scheduleEnd(() => END_TIME)
		.insertOne()
		const value = Promise.resolve(makeInitialState(model.id))
		const constraints = {
			"doesBelongToUser": {
				"anyPermissionCombinationForBypass": [
					UPDATE_ANYONE_ON_OWN_DEPARTMENT,
					UPDATE_ANYONE_ON_ALL_DEPARTMENTS
				],
				permissionGroup
			},
			"field": "hello",
			"manager": {
				"className": Manager,
				"columnName": "id"
			},
			"request": {
				"user": userFactory.serialize(admin) as Serializable
			} as Request,
			"source": {}
		} as unknown as ValidationConstraints<Request>
		& Partial<DoesBelongToCurrentUserConstraints<UserPermissions>>

		const sanitizeValue = (await doesBelongToUser(value, constraints)).value

		expect(sanitizeValue).toEqual(model.id)
	})

	it("cannot accept invalid value", async() => {
		const START_TIME = 3
		const END_TIME = 300
		const role = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...UPDATE_OWN_DATA))
		.insertOne()
		const userFactory = new UserFactory()
		const otherUser = await userFactory.attach(role).insertOne()
		const user = await userFactory.insertOne()
		const model = await new Factory()
		.user(() => Promise.resolve(user))
		.scheduleStart(() => START_TIME)
		.scheduleEnd(() => END_TIME)
		.insertOne()
		const value = Promise.resolve(makeInitialState(model.id))
		const constraints = {
			"doesBelongToUser": {
				"anyPermissionCombinationForBypass": [
					UPDATE_ANYONE_ON_OWN_DEPARTMENT,
					UPDATE_ANYONE_ON_ALL_DEPARTMENTS
				],
				permissionGroup
			},
			"field": "hello",
			"manager": {
				"className": Manager,
				"columnName": "id"
			},
			"request": {
				"user": userFactory.serialize(otherUser) as Serializable
			} as Request,
			"source": {}
		} as unknown as ValidationConstraints<Request>
		& Partial<DoesBelongToCurrentUserConstraints<UserPermissions>>

		const error = doesBelongToUser(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})
})
