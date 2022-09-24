import MockRequester from "~/setups/mock_requester"

import Middleware from "./force_redirector"

describe("Middleware: force redirector", () => {
	const requester = new MockRequester()

	it("can redirect", async() => {
		const sender = new Middleware("/example")

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
})
