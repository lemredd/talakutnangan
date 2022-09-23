import MockRequester from "~/setups/mock_requester"

import { JSON_API_MEDIA_TYPE } from "$/types/server"
import RequestEnvironment from "$/singletons/request_environment"
import ResponseInfo from "./response_info"

describe("Back-end Base: Response info", () => {
	const requester = new MockRequester()

	it("send no content", async () => {
		const responseInfo = new ResponseInfo(RequestEnvironment.status.NO_CONTENT, null)

		await requester.runResponder(responseInfo.sendThrough.bind(responseInfo))

		requester.expectResponse({
			status: (statusMethod: jest.Mock<any, any>) => {
				expect(statusMethod).toHaveBeenCalledTimes(1)
				expect(statusMethod.mock.calls[0][0]).toBe(RequestEnvironment.status.NO_CONTENT)
			},
			type: (typeMethod: jest.Mock<any, any>) => {
				expect(typeMethod).toHaveBeenCalledTimes(1)
				expect(typeMethod.mock.calls[0][0]).toBe(JSON_API_MEDIA_TYPE)
			},
			send: (sendMethod: jest.Mock<any, any>) => {
				expect(sendMethod).not.toHaveBeenCalled()
			}
		})
	})

	it("send with content", async () => {
		const responseInfo = new ResponseInfo(RequestEnvironment.status.OK, { hello: "world" })

		await requester.runResponder(responseInfo.sendThrough.bind(responseInfo))

		requester.expectResponse({
			status: (statusMethod: jest.Mock<any, any>) => {
				expect(statusMethod).toHaveBeenCalledTimes(1)
				expect(statusMethod.mock.calls[0][0]).toBe(RequestEnvironment.status.OK)
			},
			type: (typeMethod: jest.Mock<any, any>) => {
				expect(typeMethod).toHaveBeenCalledTimes(1)
				expect(typeMethod.mock.calls[0][0]).toBe(JSON_API_MEDIA_TYPE)
			},
			send: (sendMethod: jest.Mock<any, any>) => {
				expect(sendMethod).toHaveBeenCalledTimes(1)
				expect(sendMethod.mock.calls[0][0]).toStrictEqual({ hello: "world" })
			}
		})
	})

	it("send with content with custom type", async () => {
		const responseInfo = new ResponseInfo(
			RequestEnvironment.status.OK,
			"text/plain",
			"Hello world!"
		)

		await requester.runResponder(responseInfo.sendThrough.bind(responseInfo))

		requester.expectResponse({
			status: (statusMethod: jest.Mock<any, any>) => {
				expect(statusMethod).toHaveBeenCalledTimes(1)
				expect(statusMethod.mock.calls[0][0]).toBe(RequestEnvironment.status.OK)
			},
			type: (typeMethod: jest.Mock<any, any>) => {
				expect(typeMethod).toHaveBeenCalledTimes(1)
				expect(typeMethod.mock.calls[0][0]).toBe("text/plain")
			},
			send: (sendMethod: jest.Mock<any, any>) => {
				expect(sendMethod).toHaveBeenCalledTimes(1)
				expect(sendMethod.mock.calls[0][0]).toStrictEqual("Hello world!")
			}
		})
	})
})
