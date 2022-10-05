import Stub from "$/singletons/stub"
import RequestEnvironment from "$/singletons/request_environment"
import makeUnique from "$/array/make_unique"

export default class BodyCSSClasses extends RequestEnvironment {
	private CSSClasses: string[]
	private body: HTMLBodyElement

	constructor(body: HTMLBodyElement|string[]) {
		super()
		const [
			resolvedBody,
			resolvedCSSClasses
		] = Stub.runConditionally<[HTMLBodyElement, string[]]>(
			() => {
				const castBody = body as HTMLBodyElement
				const CSSClasses = [ ...castBody.classList.values() ]

				return [ castBody, CSSClasses ]
			},
			() => [ [
					{} as unknown as HTMLBodyElement,
					body as string[]
			], {
				"arguments": [ body ],
				"functionName": "constructor"
			} ]
		)

		this.body = resolvedBody
		this.CSSClasses = resolvedCSSClasses
	}

	darken(): void {
		const newClasses = makeUnique([ ...this.CSSClasses, "dark" ])

		Stub.runConditionally(
			() => {
				this.body.classList.remove(...this.CSSClasses)
				this.body.classList.add(...newClasses)
			},
			() => [ {} as unknown as void, {
				"arguments": [],
				"functionName": "darken"
			} ]
		)

		this.CSSClasses = newClasses
	}

	lighten(): void {
		const newClasses = this.CSSClasses.filter(CSSClass => CSSClass !== "dark")

		Stub.runConditionally(
			() => {
				this.body.classList.remove(...this.CSSClasses)
				this.body.classList.add(...newClasses)
			},
			() => [ {} as unknown as void, {
				"arguments": [],
				"functionName": "lighten"
			} ]
		)

		this.CSSClasses = newClasses
	}

	scroll(mustScroll: boolean): void {
		const newClasses = mustScroll
			? this.CSSClasses.filter(CSSClass => CSSClass !== "unscrollable")
			: makeUnique([ ...this.CSSClasses, "unscrollable" ])

		Stub.runConditionally(
			() => {
				this.body.classList.remove(...this.CSSClasses)
				this.body.classList.add(...newClasses)
			},
			() => [ {} as unknown as void, {
				"arguments": [ mustScroll ],
				"functionName": "scroll"
			} ]
		)

		this.CSSClasses = newClasses
	}

	get bodyClasses(): readonly string[] {
		return [ ...this.CSSClasses ]
	}
}
