import ErrorBag from "$!/errors/error_bag"
import UserFactory from "~/factories/user"
import MockRequester from "~/set-ups/mock_requester"
import DepartmentFactory from "~/factories/department"
import Controller from "./update(id).patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: PATCH /api/department/:id", () => {
	const requester = new MockRequester()

	it("can accept valid info with new details", async() => {
		const { password, profile } = await new UserFactory().insertProfile()
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const department = await new DepartmentFactory().insertOne()
		const newDepartment = await new DepartmentFactory().makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"acronym": newDepartment.acronym,
						"fullName": newDepartment.fullName,
						"mayAdmit": department.mayAdmit
					},
					"id": String(department.id),
					"type": "department"
				},
				"meta": {
					password
				}
			},
			"user": profile
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("can accept valid info with all-uppercase name", async() => {
		const { password, profile } = await new UserFactory().insertProfile()
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const department = await new DepartmentFactory().fullName(() => "Abc Def GHIJ").insertOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"acronym": department.acronym,
						"fullName": department.fullName,
						"mayAdmit": department.mayAdmit
					},
					"id": String(department.id),
					"type": "department"
				},
				"meta": {
					password
				}
			},
			"user": profile
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("cannot accept non-unique full name", async() => {
		const { password, profile } = await new UserFactory().insertProfile()
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const department = await new DepartmentFactory().insertOne()
		const otherDepartment = await new DepartmentFactory().insertOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"acronym": otherDepartment.acronym,
						"fullName": otherDepartment.fullName,
						"mayAdmit": department.mayAdmit
					},
					"id": String(department.id),
					"type": "department"
				},
				"meta": {
					password
				}
			},
			"user": profile
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(2)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.acronym")
		expect(body).toHaveProperty("1.source.pointer", "data.attributes.fullName")
	})

	it("cannot accept invalid full name", async() => {
		const { password, profile } = await new UserFactory().insertProfile()
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const department = await new DepartmentFactory().insertOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"acronym": department.acronym,
						"fullName": `${department.fullName}1`,
						"mayAdmit": department.mayAdmit
					},
					"id": String(department.id),
					"type": "department"
				},
				"meta": {
					password
				}
			},
			"user": profile
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.fullName")
	})

	it("cannot accept invalid full name (as suggested by #211)", async() => {
		const { password, profile } = await new UserFactory().insertProfile()
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const department = await new DepartmentFactory()
		.fullName(() => "Hacking Lavender Throughway1")
		.insertOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"acronym": department.acronym,
						"fullName": `${department.fullName}1`,
						"mayAdmit": department.mayAdmit
					},
					"id": String(department.id),
					"type": "department"
				},
				"meta": {
					password
				}
			},
			"user": profile
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.fullName")
	})

	it("cannot accept invalid acronym", async() => {
		const { password, profile } = await new UserFactory().insertProfile()
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const department = await new DepartmentFactory().insertOne()
		// Used for generate random data
		const randomData = await new DepartmentFactory().makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"acronym": department.acronym + randomData.acronym,
						"fullName": department.fullName,
						"mayAdmit": department.mayAdmit
					},
					"id": String(department.id),
					"type": "department"
				},
				"meta": {
					password
				}
			},
			"user": profile
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.acronym")
	})

	it("cannot accept invalid value if it should be admitted", async() => {
		const { password, profile } = await new UserFactory().insertProfile()
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const department = await new DepartmentFactory().insertOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"acronym": department.acronym,
						"fullName": department.fullName,
						"mayAdmit": "123"
					},
					"id": String(department.id),
					"type": "department"
				},
				"meta": {
					password
				}
			},
			"user": profile
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.mayAdmit")
	})
})
