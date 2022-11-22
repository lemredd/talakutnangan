import ErrorBag from "$!/errors/error_bag"
import UserFactory from "~/factories/user"
import RoleFactory from "~/factories/role"
import Controller from "./update(id).patch"
import MockRequester from "~/setups/mock_requester"

const BODY_VALIDATION_INDEX = 1

describe("Controller: PATCH /api/role/:id", () => {
	const requester = new MockRequester()

	it("can accept valid info with new details", async() => {
		const { password, profile } = await new UserFactory().insertProfile()
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const role = await new RoleFactory().userFlags(1).insertOne()
		const newRole = await new RoleFactory().postFlags(2).makeOne()
		requester.customizeRequest({
			"user": profile,
			"body": {
				"data": {
					"type": "role",
					"id": String(role.id),
					"attributes": {
						"name": newRole.name,
						"tagFlags": newRole.tagFlags,
						"userFlags": newRole.userFlags,
						"postFlags": newRole.postFlags,
						"commentFlags": newRole.commentFlags,
						"semesterFlags": newRole.semesterFlags,
						"profanityFlags": newRole.profanityFlags,
						"auditTrailFlags": newRole.auditTrailFlags
					}
				},
				"meta": {
					password
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("can accept weakest role", async() => {
		const { password, profile } = await new UserFactory().insertProfile()
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const role = await new RoleFactory().userFlags(1).insertOne()
		const otherRole = await new RoleFactory().makeOne()
		requester.customizeRequest({
			"user": profile,
			"body": {
				"data": {
					"type": "role",
					"id": String(role.id),
					"attributes": {
						"name": otherRole.name,
						"tagFlags": otherRole.tagFlags,
						"userFlags": otherRole.userFlags,
						"postFlags": otherRole.postFlags,
						"commentFlags": otherRole.commentFlags,
						"semesterFlags": otherRole.semesterFlags,
						"profanityFlags": otherRole.profanityFlags,
						"auditTrailFlags": otherRole.auditTrailFlags
					}
				},
				"meta": {
					password
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("can accept strongest role", async() => {
		const { password, profile } = await new UserFactory().insertProfile()
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const role = await new RoleFactory().userFlags(1).insertOne()
		const otherRole = await new RoleFactory().superRole().makeOne()
		requester.customizeRequest({
			"user": profile,
			"body": {
				"data": {
					"type": "role",
					"id": String(role.id),
					"attributes": {
						"name": otherRole.name,
						"tagFlags": otherRole.tagFlags,
						"userFlags": otherRole.userFlags,
						"postFlags": otherRole.postFlags,
						"commentFlags": otherRole.commentFlags,
						"semesterFlags": otherRole.semesterFlags,
						"profanityFlags": otherRole.profanityFlags,
						"auditTrailFlags": otherRole.auditTrailFlags
					}
				},
				"meta": {
					password
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("can trim non-validated attributes", async() => {
		const { password, profile } = await new UserFactory().insertProfile()
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const role = await new RoleFactory().userFlags(1).insertOne()
		const newRole = await new RoleFactory().departmentFlags(2).makeOne()
		requester.customizeRequest({
			"user": profile,
			"body": {
				"data": {
					"type": "role",
					"id": String(role.id),
					"attributes": {
						"name": newRole.name,
						"departmentFlags": newRole.departmentFlags,
						"roleFlags": newRole.roleFlags,
						"tagFlags": newRole.tagFlags,
						"userFlags": newRole.userFlags,
						"postFlags": newRole.postFlags,
						"commentFlags": newRole.commentFlags,
						"semesterFlags": newRole.semesterFlags,
						"profanityFlags": newRole.profanityFlags,
						"auditTrailFlags": newRole.auditTrailFlags
					}
				},
				"meta": {
					password
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const request = requester.expectSuccess()
		expect(request).toHaveProperty("body.data.attributes.name")
		expect(request).not.toHaveProperty("body.data.attributes.departmentFlags")
		expect(request).not.toHaveProperty("body.data.attributes.roleFlags")
	})

	it("cannot accept non-unique name", async() => {
		const { password, profile } = await new UserFactory().insertProfile()
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const role = await new RoleFactory().insertOne()
		const otherRole = await new RoleFactory().insertOne()
		requester.customizeRequest({
			"user": profile,
			"body": {
				"data": {
					"type": "role",
					"id": String(role.id),
					"attributes": {
						"name": otherRole.name,
						"tagFlags": role.tagFlags,
						"userFlags": role.userFlags,
						"postFlags": role.postFlags,
						"commentFlags": role.commentFlags,
						"semesterFlags": role.semesterFlags,
						"profanityFlags": role.profanityFlags,
						"auditTrailFlags": role.auditTrailFlags
					}
				},
				"meta": {
					password
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.name")
	})

	it("cannot accept invalid name", async() => {
		const { password, profile } = await new UserFactory().insertProfile()
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const role = await new RoleFactory().insertOne()
		requester.customizeRequest({
			"user": profile,
			"body": {
				"data": {
					"type": "role",
					"id": String(role.id),
					"attributes": {
						"name": `${role.name}1`,
						"tagFlags": role.tagFlags,
						"userFlags": role.userFlags,
						"postFlags": role.postFlags,
						"commentFlags": role.commentFlags,
						"semesterFlags": role.semesterFlags,
						"profanityFlags": role.profanityFlags,
						"auditTrailFlags": role.auditTrailFlags
					}
				},
				"meta": {
					password
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.name")
	})

	it("cannot accept beyond strongest role", async() => {
		const { password, profile } = await new UserFactory().insertProfile()
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const role = await new RoleFactory().userFlags(1).insertOne()
		const otherRole = await new RoleFactory().superRole().makeOne()
		requester.customizeRequest({
			"user": profile,
			"body": {
				"data": {
					"type": "role",
					"id": String(role.id),
					"attributes": {
						"name": otherRole.name,
						"tagFlags": otherRole.tagFlags + 1,
						"userFlags": otherRole.userFlags + 1,
						"postFlags": otherRole.postFlags + 1,
						"commentFlags": otherRole.commentFlags + 1,
						"semesterFlags": otherRole.semesterFlags + 1,
						"profanityFlags": otherRole.profanityFlags + 1,
						"auditTrailFlags": otherRole.auditTrailFlags + 1
					}
				},
				"meta": {
					password
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(7)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.auditTrailFlags")
		expect(body).toHaveProperty("1.source.pointer", "data.attributes.commentFlags")
		expect(body).toHaveProperty("2.source.pointer", "data.attributes.postFlags")
		expect(body).toHaveProperty("3.source.pointer", "data.attributes.profanityFlags")
		expect(body).toHaveProperty("4.source.pointer", "data.attributes.semesterFlags")
		expect(body).toHaveProperty("5.source.pointer", "data.attributes.tagFlags")
		expect(body).toHaveProperty("6.source.pointer", "data.attributes.userFlags")
	})
})
