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

	it("can override route", () => {
		class ControllerB extends Controller {
			private handle(request: Request, response: Response): void {}
		}
		const targetURL = "/a/b"

		const { URL, handlers } = (new ControllerB(targetURL, true)).generateRoute("/c")

		expect(URL).toBe(targetURL)
	})

	it("can prefix route", () => {
		class ControllerC extends Controller {
			private handle(request: Request, response: Response): void {}
		}
		const targetURL = "/c/d"

		const { URL, handlers } = (new ControllerC(targetURL, false)).generateRoute("/a/b")

		expect(URL).toBe(`/a/b/${targetURL}`)
	})
})
