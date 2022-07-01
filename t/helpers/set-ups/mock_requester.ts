
import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"
import type { MockResponse } from "!/types/test"

import type { Request, Response, NextFunction } from "!/types/dependent"
import RequestEnvironment from "$/helpers/request_environment"

/**
 * A set-up class used for testing the middlewares.
 */
export default class<T extends Request> extends RequestEnvironment {
	private request: T
	private response: Response
	private next: NextFunction
	private mockClear: Function
	private oldProperties: { [key:string]: any } = []

	constructor() {
		super()

		this.request = makeRequest<T>()

		const { res: response, next, mockClear } = makeResponse()

		this.response = response
		this.next = next
		this.mockClear = mockClear


		afterEach(() => this.reset())
	}

	customizeRequest(properties: { [key:string]: any }): void {
		for (const key in properties) {
			if (Object.prototype.hasOwnProperty.call(properties, key)) {
				const value = properties[key];
				// this.oldProperties[key] = value

				// @ts-ignore
				this.request[key] = value
			}
		}
	}

	customizeResponse(properties: { [key:string]: any }): void {
		for (const key in properties) {
			if (Object.prototype.hasOwnProperty.call(properties, key)) {
				const value = properties[key];
				// @ts-ignore
				this.response[key] = value
			}
		}
	}

	async runMiddleware(middleware: Function): Promise<void> {
		await middleware(this.request, this.response, this.next)
	}

	expectSuccess(): any {
		expect(this.next).toHaveBeenCalled()

		return this.request
	}

	expectFailure(status: number): any {
		this.expectResponse({
			status: (statusMethod: jest.Mock<any, any>) => {
				expect(statusMethod).toBeCalled()
				expect(statusMethod.mock.calls[0]).toEqual([ status ])
			},
			json: (jsonMethod: jest.Mock<any, any>) => {
				expect(jsonMethod).toBeCalled()
			}
		})

		const mockResponse = this.response as unknown as MockResponse
		return mockResponse.json.mock.calls[0][0]
	}

	expectResponse(properties: { [key:string]: (_: any) => void }): void {
		for (const key in properties) {
			if (Object.prototype.hasOwnProperty.call(properties, key)) {
				const check = properties[key];
				// @ts-ignore
				check(this.response[key])
			}
		}
	}

	reset() {
		const oldProperties = this.oldProperties
		for (const key in oldProperties) {
			if (Object.prototype.hasOwnProperty.call(oldProperties, key)) {
				const value = oldProperties[key];

				// @ts-ignore
				this.request[key] = value
			}
		}
		this.oldProperties = {}
		this.mockClear()
	}
}
