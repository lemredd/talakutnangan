import ErrorBag from "$!/errors/error_bag"
import MockRequester from "~/set-ups/mock_requester"
import RoleFactory from "~/factories/role"
import Controller from "./update(id).patch"

const ID_VALIDATION_INDEX = 0
const BODY_VALIDATION_INDEX = 1

describe("Controller: PATCH /api/role/update/:id", () => {
	const requester = new MockRequester()

	it("can accept valid info with new details", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const role = await new RoleFactory().userFlags(1).insertOne()
		const newRole = await new RoleFactory().postFlags(2).makeOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "role",
					id: role.id,
					attributes: {
						name: newRole.name,
						tagFlags: newRole.tagFlags,
						userFlags: newRole.userFlags,
						postFlags: newRole.postFlags,
						commentFlags: newRole.commentFlags,
						semesterFlags: newRole.semesterFlags,
						profanityFlags: newRole.profanityFlags,
						auditTrailFlags: newRole.auditTrailFlags
					}
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("can accept weakest role", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const role = await new RoleFactory().userFlags(1).insertOne()
		const otherRole = await new RoleFactory().makeOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "role",
					id: role.id,
					attributes: {
						name: otherRole.name,
						tagFlags: otherRole.tagFlags,
						userFlags: otherRole.userFlags,
						postFlags: otherRole.postFlags,
						commentFlags: otherRole.commentFlags,
						semesterFlags: otherRole.semesterFlags,
						profanityFlags: otherRole.profanityFlags,
						auditTrailFlags: otherRole.auditTrailFlags
					}
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("can accept strongest role", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const role = await new RoleFactory().userFlags(1).insertOne()
		const otherRole = await new RoleFactory().superRole().makeOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "role",
					id: role.id,
					attributes: {
						name: otherRole.name,
						tagFlags: otherRole.tagFlags,
						userFlags: otherRole.userFlags,
						postFlags: otherRole.postFlags,
						commentFlags: otherRole.commentFlags,
						semesterFlags: otherRole.semesterFlags,
						profanityFlags: otherRole.profanityFlags,
						auditTrailFlags: otherRole.auditTrailFlags
					}
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("cannot accept non-unique name", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const role = await new RoleFactory().insertOne()
		const otherRole = await new RoleFactory().insertOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "role",
					id: role.id,
					attributes: {
						name: otherRole.name,
						tagFlags: role.tagFlags,
						userFlags: role.userFlags,
						postFlags: role.postFlags,
						commentFlags: role.commentFlags,
						semesterFlags: role.semesterFlags,
						profanityFlags: role.profanityFlags,
						auditTrailFlags: role.auditTrailFlags
					}
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.name")
	})

	it("cannot accept invalid name", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const role = await new RoleFactory().insertOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "role",
					id: role.id,
					attributes: {
						name: role.name+"1",
						tagFlags: role.tagFlags,
						userFlags: role.userFlags,
						postFlags: role.postFlags,
						commentFlags: role.commentFlags,
						semesterFlags: role.semesterFlags,
						profanityFlags: role.profanityFlags,
						auditTrailFlags: role.auditTrailFlags
					}
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.name")
	})

	it("cannot accept beyond strongest role", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const role = await new RoleFactory().userFlags(1).insertOne()
		const otherRole = await new RoleFactory().superRole().makeOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "role",
					id: role.id,
					attributes: {
						name: otherRole.name,
						tagFlags: otherRole.tagFlags+1,
						userFlags: otherRole.userFlags+1,
						postFlags: otherRole.postFlags+1,
						commentFlags: otherRole.commentFlags+1,
						semesterFlags: otherRole.semesterFlags+1,
						profanityFlags: otherRole.profanityFlags+1,
						auditTrailFlags: otherRole.auditTrailFlags+1
					}
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
