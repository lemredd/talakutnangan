
import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"
import type { FieldRules } from "!/types/validation"
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

				// @ts-ignore
				this.oldProperties[key] = this.request[key]
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

	async runErrorHandler(handle: Function, error: Error = new Error()): Promise<void> {
		await handle(error, this.request, this.response, this.next)
	}

	async runResponder(handle: Function): Promise<void> {
		await handle(this.response)
	}

	async runValidator(handle: Function, rules: FieldRules, input: object): Promise<object> {
		return await handle(rules, this.request, input) as object
	}

	expectSuccess(): any {
		expect(this.next).toHaveBeenCalled()
		expect((this.next as jest.Mock<any, any>).mock.calls[0]).not.toHaveLength(1)

		return this.request
	}

	expectFailure(error: any): any {
		expect(this.next).toHaveBeenCalled()
		expect((this.next as jest.Mock<any, any>).mock.calls[0]).toHaveLength(1)
		expect((this.next as jest.Mock<any, any>).mock.calls[0][0]).toBeInstanceOf(error)

		return (this.next as jest.Mock<any, any>).mock.calls[0][0]
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

	expectNext(expectedParameterCheckers: any[][]): void {
		expect(this.next).toHaveBeenCalled()

		expectedParameterCheckers.forEach((parameterCheckers, i) => {
			parameterCheckers.forEach((check, j) => {
				check((this.next as jest.Mock<any, any>).mock.calls[i][j])
			})
		})
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
