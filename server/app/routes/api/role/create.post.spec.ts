import ErrorBag from "$!/errors/error_bag"
import MockRequester from "~/set-ups/mock_requester"
import RoleFactory from "~/factories/role"
import registerCustomValidators from "!/app/auth/register_custom_validators"
import Controller from "./create.post"

const BODY_VALIDATION_INDEX = 0

describe("Controller: POST /api/role/create", () => {
	const requester = new MockRequester()

	beforeAll(() => {
		registerCustomValidators()
	})

	it("can accept valid info", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const role = await new RoleFactory().userFlags(1).makeOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "role",
					attributes: {
						name: role.name,
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

		requester.expectSuccess()
	})

	it("can accept weakest role", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const role = await new RoleFactory().makeOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "role",
					attributes: {
						name: role.name,
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

		requester.expectSuccess()
	})

	it("can accept strongest role", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const role = await new RoleFactory().superRole().makeOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "role",
					attributes: {
						name: role.name,
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

		requester.expectSuccess()
	})

	it("cannot accept invalid name", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const role = await new RoleFactory().userFlags(1).makeOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "role",
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

	it("cannot accept beyond permitted actions", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const role = await new RoleFactory().superRole().makeOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "role",
					attributes: {
						name: role.name,
						tagFlags: role.tagFlags+1,
						userFlags: role.userFlags+1,
						postFlags: role.postFlags+1,
						commentFlags: role.commentFlags+1,
						semesterFlags: role.semesterFlags+1,
						profanityFlags: role.profanityFlags+1,
						auditTrailFlags: role.auditTrailFlags+1
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