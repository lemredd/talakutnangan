/* eslint-disable max-classes-per-file */
import type { Request } from "!/types/dependent"
import type { PageRequest } from "!/types/hybrid"
import type { Serializable } from "$/types/general"
import type { DocumentProps } from "$/types/server"

import "~/set-ups/database.set_up"
import Policy from "!/bases/policy"
import UserFactory from "~/factories/user"
import MockRequester from "~/set-ups/mock_requester"

import PageMiddleware from "./page_middleware"

describe("Back-end Base: Page Middleware Handler Generation", () => {
	it("can make handlers with no end handler", () => {
		class PolicyA extends Policy {
			authorize(): Promise<void> { return Promise.resolve() }
		}

		class PageMiddlewareA extends PageMiddleware {
			get filePath(): string { return __filename }

			get policy(): Policy { return new PolicyA() }

			getDocumentProps(): DocumentProps { return {} as DocumentProps }
		}

		const { handlers } = new PageMiddlewareA()

		expect(handlers.middlewares).toHaveLength(2)
		expect(handlers.controller.name).toBe("bound intermediate")
		expect(handlers.postJobs).toHaveLength(0)
		expect(handlers.endHandler).toBeNull()
	})
})

describe("Back-end Base: Page Middleware Special Features", () => {
	const requester = new MockRequester<PageRequest>()

	it("can pass page props for guests", async() => {
		class PageMiddlewareC extends PageMiddleware {
			get filePath(): string { return __filename }

			get policy(): null { return null }

			getDocumentProps(): DocumentProps { return {} as DocumentProps }

			getPageProps(unusedRequest: Request): Serializable {
				return { "hello": "world" }
			}
		}

		const enhancer = new PageMiddlewareC()
		requester.customizeRequest({
			"isAuthenticated": jest.fn(() => false)
		})


		await requester.runMiddleware(enhancer.intermediate.bind(enhancer))

		const successfulRequest = requester.expectSuccess()
		expect(successfulRequest.pageProps).toStrictEqual({
			"hello": "world",
			"userProfile": null
		})
	})

	it("can pass page props for known", async() => {
		class PageMiddlewareD extends PageMiddleware {
			get filePath(): string { return __filename }

			get policy(): null { return null }

			getDocumentProps(): DocumentProps { return {} as DocumentProps }

			getPageProps(unusedRequest: Request): Serializable {
				return { "hello": "world" }
			}
		}

		const enhancer = new PageMiddlewareD()
		requester.customizeRequest({
			"isAuthenticated": jest.fn(() => true),
			"user": await new UserFactory().makeOne()
		})

		await requester.runMiddleware(enhancer.intermediate.bind(enhancer))

		const successfulRequest = requester.expectSuccess()
		expect(successfulRequest.pageProps).toStrictEqual({
			"hello": "world",
			"userProfile": successfulRequest.user
		})
	})
})
