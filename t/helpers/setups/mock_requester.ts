import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import type { FieldRules } from "!/types/validation"
import type { Request, Response, NextFunction, BaseManagerClass } from "!/types/dependent"

import RequestEnvironment from "$/singletons/request_environment"

/**
 * A set-up class used for testing the middlewares.
 */
export default class <T extends Request> extends RequestEnvironment {
	private request: T
	private response: Response
	private next: NextFunction
	private mockClear: () => void
	private oldProperties: { [key:string]: any } = []

	constructor() {
		super()

		this.request = makeRequest<T>()

		const { "res": response, next, mockClear } = makeResponse()

		this.response = response
		this.next = next
		this.mockClear = mockClear


		afterEach(() => this.reset())
	}

	get castNext(): jest.Mock<any, any> { return this.next as jest.Mock<any, any> }

	customizeRequest(properties: { [key:string]: any }): void {
		for (const key in properties) {
			if (Object.hasOwn(properties, key)) {
				const value = properties[key]

				// @ts-ignore
				this.oldProperties[key] = this.request[key]
				// @ts-ignore
				this.request[key] = value
			}
		}
	}

	customizeResponse(properties: { [key:string]: any }): void {
		for (const key in properties) {
			if (Object.hasOwn(properties, key)) {
				const value = properties[key]
				// @ts-ignore
				this.response[key] = value
			}
		}
	}

	async runMiddleware(middleware: (
		unusedRequest: T,
		unusedResponse: Response,
		unusedNext: NextFunction
	) => Promise<void>): Promise<void> {
		await middleware(this.request, this.response, this.next)
	}

	async runErrorHandler(handle: (
		unusedError: Error,
		unusedRequest: T,
		unusedResponse: Response,
		unusedNext: NextFunction
	) => Promise<void>, error: Error = new Error()): Promise<void> {
		await handle(error, this.request, this.response, this.next)
	}

	async runResponder(handle: (unusedResponse: Response) => void): Promise<void> {
		await handle(this.response)
	}

	async runValidator(handle: (
		unusedRules: FieldRules,
		unusedRequest: T,
		unusedInput: object
	) => Promise<object>, rules: FieldRules, input: object): Promise<object> {
		return await handle(rules, this.request, input) as object
	}

	async runAsynchronousOperationInitializer(
		handle: (
			unusedRequest: T,
			Manager: BaseManagerClass,
			totalStepCount: number
		) => Promise<void>,
		Manager: BaseManagerClass,
		totalStepCount: number
	): Promise<void> {
		await handle(this.request, Manager, totalStepCount)
	}

	expectSuccess(): any {
		expect(this.next).toHaveBeenCalled()
		expect(this.castNext.mock.calls[0]).not.toHaveLength(1)

		return this.request
	}

	expectFailure(error: any): any {
		expect(this.next).toHaveBeenCalled()
		expect(this.castNext.mock.calls[0]).toHaveLength(1)
		expect(this.castNext.mock.calls[0][0]).toBeInstanceOf(error)

		return this.castNext.mock.calls[0][0]
	}

	expectResponse(properties: { [key:string]: (_: any) => void }): void {
		for (const key in properties) {
			if (Object.hasOwn(properties, key)) {
				const check = properties[key]
				// @ts-ignore
				check(this.response[key])
			}
		}
	}

	expectNext(expectedParameterCheckers: any[][]): void {
		expect(this.next).toHaveBeenCalled()

		expectedParameterCheckers.forEach((parameterCheckers, i) => {
			parameterCheckers.forEach((check, j) => {
				check(this.castNext.mock.calls[i][j])
			})
		})
	}

	reset() {
		const { oldProperties } = this
		for (const key in oldProperties) {
			if (Object.hasOwn(oldProperties, key)) {
				const value = oldProperties[key]

				// @ts-ignore
				this.request[key] = value
			}
		}
		this.oldProperties = {}
		this.mockClear()
	}
}
