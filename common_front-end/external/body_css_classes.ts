import type { GeneralObject } from "$/types/general"

import Stub from "$/singletons/stub"
import RequestEnvironment from "$/singletons/request_environment"

export default class BodyCSSClasses extends RequestEnvironment {
	private CSSClasses: string[] = []
	private body: HTMLBodyElement
	private fakeBody: Set<string>[]

	constructor(body: HTMLBodyElement|GeneralObject) {
		super()
		const [
			resolvedBody,
			resolvedFakeBody
		] = Stub.runConditionally<[HTMLBodyElement, Set<string>[]]>(
			() => {
				const castBody = body as HTMLBodyElement
				const CSSClasses = castBody.classList.value.split(" ")

				this.CSSClasses = CSSClasses
				return [ castBody, [] ]
			},
			() => [ [
					{} as unknown as HTMLBodyElement,
					[]
			], {
				"arguments": [ body ],
				"functionName": "constructor"
			} ]
		)

		this.body = resolvedBody
		this.fakeBody = resolvedFakeBody
	}
}
