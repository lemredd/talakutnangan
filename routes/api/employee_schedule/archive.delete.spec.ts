import ErrorBag from "$!/errors/error_bag"
import EmployeeSchedule from "~/factories/employee_schedule"
import MockRequester from "~/setups/mock_requester"

import Controller from "./archive.delete"

const BODY_VALIDATION_INDEX = 0

describe("Controller: DELETE /api/employee_schedule", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const employeeSchedule = await new EmployeeSchedule().insertOne()
		requester.customizeRequest({
			"body": {
				"data": [
					{
						"id": String(employeeSchedule.id),
						"type": "employee_schedule"
					}
				]
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("cannot accept already-archived resources", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const employeeSchedule = await new EmployeeSchedule().insertOne()
		await employeeSchedule.destroy({ "force": false })
		requester.customizeRequest({
			"body": {
				"data": [
					{
						"id": String(employeeSchedule.id),
						"type": "employee_schedule"
					}
				]
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.0.id")
	})

	it("cannot delete non-existent resources", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const employeeSchedule = await new EmployeeSchedule().insertOne()
		await employeeSchedule.destroy({ "force": true })
		requester.customizeRequest({
			"body": {
				"data": [
					{
						"id": String(employeeSchedule.id),
						"type": "employee_schedule"
					}
				]
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.0.id")
	})
})
