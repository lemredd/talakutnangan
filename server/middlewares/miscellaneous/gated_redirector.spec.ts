import MockRequester from "~/setups/mock_requester"

import Middleware from "./gated_redirector"

describe("Middleware: Gated redirector", () => {
	const requester = new MockRequester()

	it("can redirect", async() => {
		const sender = new Middleware("/example", () => Promise.resolve(true))

		await requester.runMiddleware(sender.intermediate.bind(sender))

		requester.expectResponse({
			"end": (end: jest.Mock<any, any>) => {
				expect(end).toHaveBeenCalled()
			},
			"writeHead": (writeHead: jest.Mock<any, any>) => {
				expect(writeHead).toHaveBeenCalled()
				expect(writeHead.mock.calls[0][0]).toBe(Middleware.status.MOVED_TEMPORARILY)
				expect(writeHead.mock.calls[0][1]).toStrictEqual({ "Location": "/example" })
			}
		})
	})

	it("cannot redirect", async() => {
		const sender = new Middleware("/example", () => Promise.resolve(false))

		await requester.runMiddleware(sender.intermediate.bind(sender))

		requester.expectSuccess()
		requester.expectResponse({
			"end": (end: jest.Mock<any, any>) => {
				expect(end).not.toHaveBeenCalled()
			},
			"writeHead": (writeHead: jest.Mock<any, any>) => {
				expect(writeHead).not.toHaveBeenCalled()
			}
		})
	})
})
