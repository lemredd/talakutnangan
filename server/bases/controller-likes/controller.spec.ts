import { EndHandler } from "!/types/hybrid"
import { Request, Response } from "!/types/dependent"

import Validation from "!/bases/validation"
import endRequest from "!/helpers/end_request"
import MockRequester from "~/setups/mock_requester"

import Controller from "./controller"

describe("Back-end Base: Controller Special Features", () => {
	abstract class BaseTestController extends Controller {
		get filePath(): string { return __filename }

		get endHandler(): EndHandler { return endRequest }

		get policy(): null { return null }

		get bodyParser(): null { return null }

		get validations(): Validation[] { return [] }
	}

	const requester = new MockRequester()

	it("can run handle", async () => {
		const handleFunction = jest.fn()

		class ControllerB extends BaseTestController {
			async handle(request: Request, response: Response): Promise<void> {
				handleFunction()
			}
		}

		const controller = new ControllerB()

		await requester.runMiddleware(controller.intermediate.bind(controller))

		requester.expectSuccess()
	})
})
