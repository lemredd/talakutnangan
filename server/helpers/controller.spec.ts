import Database from "~/database"
import Middleware from "!/helpers/middleware"
import { Request, Response } from "express"

import Controller from "./controller"

describe("Back-end: Base Controller", () => {
	it("can create simple route", () => {
		class ControllerA extends Controller {
			private handle(request: Request, response: Response): void {}
		}
		const targetURL = "/"

		const { URL, handlers } = (new ControllerA(targetURL)).generateRoute()

		expect(URL).toBe(targetURL)
		expect(handlers).toHaveLength(1)
	})
})
