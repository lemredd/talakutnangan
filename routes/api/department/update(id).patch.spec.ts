import ErrorBag from "$!/errors/error_bag"
import MockRequester from "~/set-ups/mock_requester"
import setUpDatabase from "~/set-ups/database.set_up"
import DepartmentFactory from "~/factories/department"

import Controller from "./update(id).patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: PATCH /api/department/update/:id", () => {
	setUpDatabase()

	const requester = new MockRequester()

	it("can accept valid info with new details", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const department = await new DepartmentFactory().insertOne()
		const newDepartment = await new DepartmentFactory().makeOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "department",
					id: department.id,
					attributes: {
						acronym: newDepartment.acronym,
						fullName: newDepartment.fullName,
						mayAdmit: department.mayAdmit
					}
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("can accept valid info with all-uppercase name", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const department = await (new DepartmentFactory().name(() => "Abc Def GHIJ")).insertOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "department",
					id: department.id,
					attributes: {
						acronym: department.acronym,
						fullName: department.fullName,
						mayAdmit: department.mayAdmit
					}
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("cannot accept non-unique full name", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const department = await new DepartmentFactory().insertOne()
		const otherDepartment = await new DepartmentFactory().insertOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "department",
					id: department.id,
					attributes: {
						acronym: otherDepartment.acronym,
						fullName: otherDepartment.fullName,
						mayAdmit: department.mayAdmit
					}
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(2)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.acronym")
		expect(body).toHaveProperty("1.source.pointer", "data.attributes.fullName")
	})

	it("cannot accept invalid full name", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const department = await new DepartmentFactory().insertOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "department",
					id: department.id,
					attributes: {
						acronym: department.acronym,
						fullName: department.fullName+"1",
						mayAdmit: department.mayAdmit
					}
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.fullName")
	})

	it("cannot accept invalid full name (as suggested by #211)", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const department = await new DepartmentFactory()
			.name(() => "Hacking Lavender Throughway1")
			.insertOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "department",
					id: department.id,
					attributes: {
						acronym: department.acronym,
						fullName: department.fullName+"1",
						mayAdmit: department.mayAdmit
					}
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.fullName")
	})

	it("cannot accept invalid acronym", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const department = await new DepartmentFactory().insertOne()
		const randomData = await new DepartmentFactory().makeOne() // Used for generate random data
		requester.customizeRequest({
			body: {
				data: {
					type: "department",
					id: department.id,
					attributes: {
						acronym: department.acronym+randomData.acronym,
						fullName: department.fullName,
						mayAdmit: department.mayAdmit
					}
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.acronym")
	})

	it("cannot accept invalid value if it should be admitted", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const department = await new DepartmentFactory().insertOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "department",
					id: department.id,
					attributes: {
						acronym: department.acronym,
						fullName: department.fullName,
						mayAdmit: "123"
					}
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.mayAdmit")
	})
})
