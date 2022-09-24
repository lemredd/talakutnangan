/* eslint-disable max-classes-per-file */
import type { Request, Response, NextFunction } from "!/types/dependent"

import MockRequester from "~/setups/mock_requester"
import Middleware from "!/bases/middleware"

import Merger from "./merger"

describe("Middleware: Merger", () => {
	const requester = new MockRequester()

	it("can merge", async() => {
		const middlewareStatementA = jest.fn()
		const middlewareA = new class extends Middleware {
			intermediate(
				unusedRequest: Request,
				unusedResponse: Response,
				next: NextFunction
			): Promise<void> {
				middlewareStatementA()
				next()
				return Promise.resolve()
			}
		}()
		const middlewareStatementB = jest.fn()
		const middlewareB = new class extends Middleware {
			intermediate(
				unusedRequest: Request,
				unusedResponse: Response,
				next: NextFunction
			): Promise<void> {
				middlewareStatementB()
				next()
				return Promise.resolve()
			}
		}()
		const middleware = new Merger([ middlewareA, middlewareB ])

		await requester.runMiddleware(middleware.intermediate.bind(middleware))

		requester.expectSuccess()
		expect(middlewareStatementA).toHaveBeenCalled()
		expect(middlewareStatementB).toHaveBeenCalled()
	})

	it("can stop upon error", async() => {
		const middlewareStatementA = jest.fn()
		const middlewareA = new class extends Middleware {
			intermediate(
				unusedRequest: Request,
				unusedResponse: Response,
				next: NextFunction
			): Promise<void> {
				middlewareStatementA()
				next()
				return Promise.resolve()
			}
		}()
		const middlewareStatementB = jest.fn()
		const middlewareB = new class extends Middleware {
			intermediate(
				unusedRequest: Request,
				unusedResponse: Response,
				next: NextFunction
			): Promise<void> {
				middlewareStatementB()
				next(new Error())
				return Promise.resolve()
			}
		}()
		const middlewareStatementC = jest.fn()
		const middlewareC = new class extends Middleware {
			intermediate(
				unusedRequest: Request,
				unusedResponse: Response,
				next: NextFunction
			): Promise<void> {
				middlewareStatementC()
				next()
				return Promise.resolve()
			}
		}()
		const middleware = new Merger([ middlewareA, middlewareB, middlewareC ])

		await requester.runMiddleware(middleware.intermediate.bind(middleware))

		requester.expectFailure(Error)
		expect(middlewareStatementA).toHaveBeenCalled()
		expect(middlewareStatementB).toHaveBeenCalled()
		expect(middlewareStatementC).not.toHaveBeenCalled()
	})
})
