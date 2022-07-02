import BaseError from "$!/errors/base"
import MockRequester from "~/set-ups/mock_requester"
import RequestEnvironment from "$/helpers/request_environment"

import catchAllErrors from "./catch_all_errors"

describe("Server: Catching all errors", () => {
	const requester = new MockRequester()

	it("can only end response once if others previously ended the response", () => {
		const customEndMethod = jest.fn()
		customEndMethod()
		requester.customizeResponse({
			writableEnded: true,
			end: customEndMethod
		})

		requester.runErrorHandler(catchAllErrors)

		requester.expectResponse({
			end: (endMethod: jest.Mock<any, any>) => {
				expect(endMethod).toHaveBeenCalledTimes(1)
			}
		})
	})

	it("can only automatically end response for header-sent only responses", () => {
		requester.customizeResponse({
			writableEnded: false,
			headersSent: true
		})

		requester.runErrorHandler(catchAllErrors)

		requester.expectResponse({
			status: (statusMethod: jest.Mock<any, any>) => {
				expect(statusMethod).not.toHaveBeenCalled()
			},
			end: (endMethod: jest.Mock<any, any>) => {
				expect(endMethod).toHaveBeenCalledTimes(1)
			}
		})
	})

	it.todo("redirect to error page if it can accept HTML media type")

	it("can output common error if it only accepts JSON:API media type", () => {
		requester.customizeRequest({
			accepts: jest.fn(mediaType => mediaType === "application/vnd.api+json")
		})

		requester.runErrorHandler(catchAllErrors)

		requester.expectResponse({
			status: (statusMethod: jest.Mock<any, any>) => {
				expect(statusMethod).toHaveBeenCalled()
				expect(statusMethod.mock.calls[0][0])
					.toBe(RequestEnvironment.status.INTERNAL_SERVER_ERROR)
			},
			type: (typeMethod: jest.Mock<any, any>) => {
				expect(typeMethod).toHaveBeenCalled()
				expect(typeMethod.mock.calls[0][0]).toBe("application/vnd.api+json")
			},
			send: (sendMethod: jest.Mock<any, any>) => {
				expect(sendMethod).toHaveBeenCalled()
			},
			end: (endMethod: jest.Mock<any, any>) => {
				expect(endMethod).toHaveBeenCalledTimes(1)
			}
		})
	})

	it("can output custom error if it only accepts JSON:API media type", () => {
		requester.customizeRequest({
			accepts: jest.fn(mediaType => mediaType === "application/vnd.api+json")
		})
		const error = new BaseError(
			"0",
			RequestEnvironment.status.BAD_REQUEST,
			"title",
			"message")

		requester.runErrorHandler(catchAllErrors, error)

		requester.expectResponse({
			status: (statusMethod: jest.Mock<any, any>) => {
				expect(statusMethod).toHaveBeenCalled()
				expect(statusMethod.mock.calls[0][0]).toBe(RequestEnvironment.status.BAD_REQUEST)
			},
			type: (typeMethod: jest.Mock<any, any>) => {
				expect(typeMethod).toHaveBeenCalled()
				expect(typeMethod.mock.calls[0][0]).toBe("application/vnd.api+json")
			},
			send: (sendMethod: jest.Mock<any, any>) => {
				expect(sendMethod).toHaveBeenCalled()
				expect(sendMethod.mock.calls[0][0]).toStrictEqual({
					errors: [
						error.toJSON()
					]
				})
			},
			end: (endMethod: jest.Mock<any, any>) => {
				expect(endMethod).toHaveBeenCalledTimes(1)
			}
		})
	})
})
