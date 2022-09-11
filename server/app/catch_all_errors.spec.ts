import { Buffer } from "buffer"
import BaseError from "$!/errors/base"
import ErrorBag from "$!/errors/error_bag"
import URLMaker from "$!/singletons/url_maker"
import MockRequester from "~/set-ups/mock_requester"
import RequestEnvironment from "$/singletons/request_environment"
import { HTML_MEDIA_TYPE, JSON_API_MEDIA_TYPE } from "$/types/server"

import catchAllErrors from "./catch_all_errors"

describe("Server: Catching all errors", () => {
	const requester = new MockRequester()

	it("can destroy transaction", async () => {
		const customDestroyMethod = jest.fn()
		requester.customizeRequest({
			transaction: {
				destroyIneffectually: customDestroyMethod
			}
		})
		requester.customizeResponse({
			writableEnded: true,
			end: jest.fn()
		})

		await requester.runErrorHandler(catchAllErrors)

		requester.expectSuccess()
		expect(customDestroyMethod).toBeCalledTimes(1)
	})

	it("can only end response once if others previously ended the response", async () => {
		const customEndMethod = jest.fn()
		customEndMethod()
		requester.customizeRequest({
			transaction: {
				destroyIneffectually: jest.fn()
			}
		})
		requester.customizeResponse({
			writableEnded: true,
			end: customEndMethod
		})

		await requester.runErrorHandler(catchAllErrors)

		requester.expectResponse({
			end: (endMethod: jest.Mock<any, any>) => {
				expect(endMethod).toHaveBeenCalledTimes(1)
			}
		})
	})

	it("can only automatically end response for header-sent only responses", async () => {
		requester.customizeRequest({
			transaction: {
				destroyIneffectually: jest.fn()
			}
		})
		requester.customizeResponse({
			writableEnded: false,
			headersSent: true
		})

		await requester.runErrorHandler(catchAllErrors)

		requester.expectResponse({
			status: (statusMethod: jest.Mock<any, any>) => {
				expect(statusMethod).not.toHaveBeenCalled()
			},
			end: (endMethod: jest.Mock<any, any>) => {
				expect(endMethod).toHaveBeenCalledTimes(1)
			}
		})
	})

	it("redirect to root if it can accept HTML media type", async () => {
		requester.customizeRequest({
			transaction: {
				destroyIneffectually: jest.fn()
			}
		})
		requester.customizeRequest({
			accepts: jest.fn(mediaType => mediaType === HTML_MEDIA_TYPE)
		})
		const error = new BaseError(
			"0",
			RequestEnvironment.status.BAD_REQUEST,
			"title",
			"message")

		await requester.runErrorHandler(catchAllErrors, error)

		requester.expectResponse({
			redirect: (redirectMethod: jest.Mock<any, any>) => {
				expect(redirectMethod).toHaveBeenCalled()
				expect(redirectMethod.mock.calls[0][0]).toContain(URLMaker.makeBaseURL())
				expect(redirectMethod.mock.calls[0][0]).toContain(
					Buffer.from(JSON.stringify(error.toJSON())).toString("base64url")
				)
			},
			end: (endMethod: jest.Mock<any, any>) => {
				expect(endMethod).toHaveBeenCalledTimes(1)
			}
		})
	})

	it("redirect to root if it can accept HTML media type and there multiple errors", async () => {
		requester.customizeRequest({
			transaction: {
				destroyIneffectually: jest.fn()
			}
		})
		requester.customizeRequest({
			accepts: jest.fn(mediaType => mediaType === HTML_MEDIA_TYPE)
		})
		const error = new ErrorBag([
			new BaseError(
				"0",
				RequestEnvironment.status.BAD_REQUEST,
				"title",
				"message"
			)
		])

		await requester.runErrorHandler(catchAllErrors, error)

		requester.expectResponse({
			redirect: (redirectMethod: jest.Mock<any, any>) => {
				expect(redirectMethod).toHaveBeenCalled()
				expect(redirectMethod.mock.calls[0][0]).toContain(URLMaker.makeBaseURL())
				expect(redirectMethod.mock.calls[0][0]).toContain(
					Buffer.from(JSON.stringify(error.toJSON())).toString("base64url")
				)
			},
			end: (endMethod: jest.Mock<any, any>) => {
				expect(endMethod).toHaveBeenCalledTimes(1)
			}
		})
	})

	it("redirect to custom redirect URL if it can accept HTML media type", async () => {
		requester.customizeRequest({
			transaction: {
				destroyIneffectually: jest.fn()
			}
		})
		requester.customizeRequest({
			accepts: jest.fn(mediaType => mediaType === HTML_MEDIA_TYPE)
		})
		const customRedirectURL = `${URLMaker.makeBaseURL()}/log_in`
		const error = new BaseError(
			"0",
			RequestEnvironment.status.BAD_REQUEST,
			"title",
			"message",
			customRedirectURL)

		await requester.runErrorHandler(catchAllErrors, error)

		requester.expectResponse({
			redirect: (redirectMethod: jest.Mock<any, any>) => {
				expect(redirectMethod).toHaveBeenCalled()
				expect(redirectMethod.mock.calls[0][0]).toContain(customRedirectURL)
				expect(redirectMethod.mock.calls[0][0]).toContain(
					Buffer.from(JSON.stringify(error.toJSON())).toString("base64url")
				)
			},
			end: (endMethod: jest.Mock<any, any>) => {
				expect(endMethod).toHaveBeenCalledTimes(1)
			}
		})
	})

	it("can output common error if it only accepts JSON:API media type", async () => {
		requester.customizeRequest({
			transaction: {
				destroyIneffectually: jest.fn()
			}
		})
		requester.customizeRequest({
			accepts: jest.fn(mediaType => mediaType === JSON_API_MEDIA_TYPE)
		})

		await requester.runErrorHandler(catchAllErrors)

		requester.expectResponse({
			status: (statusMethod: jest.Mock<any, any>) => {
				expect(statusMethod).toHaveBeenCalled()
				expect(statusMethod.mock.calls[0][0])
					.toBe(RequestEnvironment.status.INTERNAL_SERVER_ERROR)
			},
			type: (typeMethod: jest.Mock<any, any>) => {
				expect(typeMethod).toHaveBeenCalled()
				expect(typeMethod.mock.calls[0][0]).toBe(JSON_API_MEDIA_TYPE)
			},
			send: (sendMethod: jest.Mock<any, any>) => {
				expect(sendMethod).toHaveBeenCalled()
			},
			end: (endMethod: jest.Mock<any, any>) => {
				expect(endMethod).toHaveBeenCalledTimes(1)
			}
		})
	})

	it("can output custom error if it only accepts JSON:API media type", async () => {
		requester.customizeRequest({
			transaction: {
				destroyIneffectually: jest.fn()
			}
		})
		requester.customizeRequest({
			accepts: jest.fn(mediaType => mediaType === JSON_API_MEDIA_TYPE)
		})
		const error = new BaseError(
			"0",
			RequestEnvironment.status.BAD_REQUEST,
			"title",
			"message")

		await requester.runErrorHandler(catchAllErrors, error)

		requester.expectResponse({
			status: (statusMethod: jest.Mock<any, any>) => {
				expect(statusMethod).toHaveBeenCalled()
				expect(statusMethod.mock.calls[0][0]).toBe(RequestEnvironment.status.BAD_REQUEST)
			},
			type: (typeMethod: jest.Mock<any, any>) => {
				expect(typeMethod).toHaveBeenCalled()
				expect(typeMethod.mock.calls[0][0]).toBe(JSON_API_MEDIA_TYPE)
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

	it("can output multiple custom errors if it only accepts JSON:API media type", async () => {
		requester.customizeRequest({
			transaction: {
				destroyIneffectually: jest.fn()
			}
		})
		requester.customizeRequest({
			accepts: jest.fn(mediaType => mediaType === JSON_API_MEDIA_TYPE)
		})
		const error = new ErrorBag([
			new BaseError(
				"0",
				RequestEnvironment.status.UNAUTHORIZED,
				"title",
				"message"
			)
		])

		await requester.runErrorHandler(catchAllErrors, error)

		requester.expectResponse({
			status: (statusMethod: jest.Mock<any, any>) => {
				expect(statusMethod).toHaveBeenCalled()
				expect(statusMethod.mock.calls[0][0]).toBe(RequestEnvironment.status.BAD_REQUEST)
			},
			type: (typeMethod: jest.Mock<any, any>) => {
				expect(typeMethod).toHaveBeenCalled()
				expect(typeMethod.mock.calls[0][0]).toBe(JSON_API_MEDIA_TYPE)
			},
			send: (sendMethod: jest.Mock<any, any>) => {
				expect(sendMethod).toHaveBeenCalled()
				expect(sendMethod.mock.calls[0][0]).toStrictEqual({
					errors: error.toJSON()
				})
			},
			end: (endMethod: jest.Mock<any, any>) => {
				expect(endMethod).toHaveBeenCalledTimes(1)
			}
		})
	})
})
