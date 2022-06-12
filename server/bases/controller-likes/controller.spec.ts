import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import { EndHandler } from "!/types/hybrid"
import { Request, Response } from "!/types/dependent"

import Validation from "!/bases/validation"
import endRequest from "!/helpers/end_request"

import Controller from "./controller"

describe("Back-end: Base Controller", () => {
	abstract class BaseTestController extends Controller {
		get filePath(): string { return __filename }

		get endHandler(): EndHandler { return endRequest }

		get policy(): null { return null }

		get bodyParser(): null { return null }

		get validations(): Validation[] { return [] }
	}

	it("can make handlers", () => {
		class ControllerA extends BaseTestController {
			async handle(request: Request, response: Response): Promise<void> {}
		}

		const handlers = (new ControllerA()).handlers

		expect(handlers.middlewares).toHaveLength(2)
		expect(handlers.controller.name).toBe("bound intermediate")
		expect(handlers.postJobs).toHaveLength(0)
		expect(handlers.endHandler).toBeNull()
	})

	it("can run handler", async () => {
		const handleFunction = jest.fn()

		class ControllerB extends BaseTestController {
			async handle(request: Request, response: Response): Promise<void> {
				handleFunction()
			}
		}

		const controller = new ControllerB()

		const request  = makeRequest<Request>()
		const { res: response, next, } = makeResponse()
		await controller.intermediate(request, response, next)

		expect(next).toHaveBeenCalled()
	})
})
