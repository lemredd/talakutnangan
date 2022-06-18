
import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"
import type { MockResponse } from "!/types/test"

import type { Request, Response, NextFunction } from "!/types/dependent"
import RequestEnvironment from "$/helpers/request_environment"

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

	async runMiddleware(middleware: Function): Promise<void> {
		await middleware(this.request, this.response, this.next)
	}

	expectSuccess(): void {
		expect(this.next).toHaveBeenCalled()
	}

	expectFailure(status: number): any {
		const mockResponse = this.response as unknown as MockResponse
		expect(mockResponse.status).toHaveBeenCalled()
		expect(mockResponse.status.mock.calls[0]).toEqual([ status ])
		expect(mockResponse.json).toHaveBeenCalled()

		return mockResponse.json.mock.calls[0][0]
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
